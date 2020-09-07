import adapter from 'webrtc-adapter';
import store from './../store';

const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
}
let remoteVideo
let pc1
let pc2
const handle = {
    call: async () => {
        console.log('Starting call');
        const localStream = store.getStream();
        const videoTracks = localStream.getVideoTracks();
        const audioTracks = localStream.getAudioTracks();
        if (videoTracks.length > 0) {
          console.log(`Using video device: ${videoTracks[0].label}`);
        }
        if (audioTracks.length > 0) {
          console.log(`Using audio device: ${audioTracks[0].label}`);
        }
        const configuration = store.getSdp() ? {sdpSemantics: store.getSdp()} : {};
        /***
         * sdpSemanticsOption
         * {sdpSemantics: 'unified-plan' and 'plan-b'} or {}
         *  */

        console.log('RTCPeerConnection configuration:', configuration);
        pc1 = new RTCPeerConnection(configuration);
        console.log('Created local peer connection object pc1');
        pc1.addEventListener('icecandidate', e => handle.onIceCandidate(pc1, e));
        pc2 = new RTCPeerConnection(configuration);
        console.log('Created remote peer connection object pc2');
        pc2.addEventListener('icecandidate', e => handle.onIceCandidate(pc2, e));
        pc1.addEventListener('iceconnectionstatechange', e => handle.onIceStateChange(pc1, e));
        pc2.addEventListener('iceconnectionstatechange', e => handle.onIceStateChange(pc2, e));
        pc2.addEventListener('track', handle.gotRemoteStream);
      
        localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
        console.log('Added local stream to pc1');
      
        try {
            console.log('pc1 createOffer start');
            const offer = await pc1.createOffer(offerOptions);
            await handle.onCreateOfferSuccess(offer);
        } catch (e) {
            console.log(e)
            handle.onCreateSessionDescriptionError(e);
        }
    },
    onIceCandidate: async (pc, event) => {
        try {
            await (handle.getOtherPc(pc).addIceCandidate(event.candidate));
            console.log(`${handle.getName(pc)} addIceCandidate success`);
        } catch (e) {
            console.log(`${handle.getName(pc)} failed to add ICE Candidate: ${e.toString()}`);
        }
        console.log(`${handle.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    },
    onCreateOfferSuccess: async (desc) => {
        console.log(`Offer from pc1\n${desc.sdp}`);
        console.log('pc1 setLocalDescription start');
        try {
            await pc1.setLocalDescription(desc);
            handle.onSetLocalSuccess(pc1);
        } catch (e) {
            handle.onSetSessionDescriptionError();
        }
      
        console.log('pc2 setRemoteDescription start');
        try {
            await pc2.setRemoteDescription(desc);
            handle.onSetRemoteSuccess(pc2);
        } catch (e) {
            handle.onSetSessionDescriptionError();
        }
      
        console.log('pc2 createAnswer start');
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        try {
            const answer = await pc2.createAnswer();
            await handle.onCreateAnswerSuccess(answer);
        } catch (e) {
            handle.onCreateSessionDescriptionError(e);
        }
    },
    onCreateAnswerSuccess: async (desc) => {
        console.log(`Answer from pc2:\n${desc.sdp}`);
        console.log('pc2 setLocalDescription start');
        try {
            await pc2.setLocalDescription(desc);
            handle.onSetLocalSuccess(pc2);
        } catch (e) {
            handle.onSetSessionDescriptionError(e);
        }
        console.log('pc1 setRemoteDescription start');
        try {
            await pc1.setRemoteDescription(desc);
            handle.onSetRemoteSuccess(pc1);
        } catch (e) {
            handle.onSetSessionDescriptionError(e);
        }
    },
    onIceStateChange: (pc, event) => {
        if (pc) {
            console.log(`${handle.getName(pc)} ICE state: ${pc.iceConnectionState}`);
            console.log('ICE state change event: ', event);
        }
    },
    gotRemoteStream: (e) => {
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('pc2 received remote stream');
        }
    },
    onCreateSessionDescriptionError: (error) => {
        console.log(`Failed to create session description: ${error.toString()}`);
    },
    onSetLocalSuccess: (pc) => {
        console.log(`${handle.getName(pc)} setLocalDescription complete`);
    },
    onSetRemoteSuccess: (pc) => {
        console.log(`${handle.getName(pc)} setRemoteDescription complete`);
    },
    onSetSessionDescriptionError: (error) => {
        console.log(`Failed to set session description: ${error.toString()}`);
    },
    getName: (pc) => {
        return (pc === pc1) ? 'pc1' : 'pc2';
    },
    getOtherPc: (pc) => {
        return (pc === pc1) ? pc2 : pc1;
    },
    hangup: () => {
        pc1.close();
        pc2.close();
        pc1 = null;
        pc2 = null;
    }
}

export const hangup = () => {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
};

export const call = async () => {
    try {
        remoteVideo = store.getRemoteId()[0]
        handle.call()
    } catch (e) {
        handle.error(e);
    }
}