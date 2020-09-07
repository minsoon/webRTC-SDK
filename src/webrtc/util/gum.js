import adapter from 'webrtc-adapter';
import store from './../store';

const constraints = {
    audio: false,
    video: false
}
let localVideo
let stream
const handle = {
    videoSuccess: (stream) => {
        const videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', store.getLocalId());
        console.log(`Using video device: ${videoTracks[0].label}`);
        window.stream = stream;
        localVideo.srcObject = stream;
        store.setStream(stream);
    },
    error: (error) => {
        console.log(error)
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            console.log(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            console.log('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
        }
    }
}
export const localStream = () => {
    return stream
};

export const gum = async () => {
    try {
        localVideo = store.getLocalId()
        constraints.video = localVideo.dataset.video === undefined ? false : localVideo.dataset.video || true
        constraints.audio = localVideo.dataset.audio === undefined ? false : localVideo.dataset.audio || true
        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (constraints.video) {
            store.setDevices(constraints);
            handle.videoSuccess(stream)
        }
    } catch (e) {
        handle.error(e);
    }
}
