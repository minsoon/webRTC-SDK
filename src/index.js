import Ws from './lib/websock'
import webrtc from './webrtc'
import store from './webrtc/store'
console.log(store)
/**
 * TODOLIST
 * - import된 webrtc 기능 활성 자동화
 */
let userDevices = {
    audioinput: [],
    audiooutput: [],
    videoinput: []
}
navigator.mediaDevices.enumerateDevices().then(res => { 
    res.map((d) => {
        userDevices[d.kind].push(d)
    })
})
class Rtc {
    Init (res) {
        return new Promise((resolve, reject) => {
            /**
             * 인증 여부 체크 후 WebSocket 연결
             */
            if (res.token) {
                store.setLocalId(document.querySelector(res.localId))
                res.remoteId.forEach((d, ) => {
                    store.setRemoteId(document.querySelector(d))
                })
                console.log(store.setRemoteId())
                store.setSdp(res.sdp)
                Ws.webSocketConnect(res.wss).then(() => {
                    /**
                     * WebSocket 연결 완료 후 기능 활성화
                     */
                    this.gum = webrtc.gum
                    this.call = webrtc.call
                    this.hangup = webrtc.hangup
                    this.audioinput = userDevices.audioinput
                    this.audiooutput = userDevices.audiooutput
                    this.videoinput = userDevices.videoinput
                    resolve()
                }).catch((err) => {
                    console.log(err)
                    alert('WebSocket 연결에 실패하였습니다.');
                });
            } else {
                reject();
            }
        })
    }
    setSdp (data) {
        store.setSdp(data)
    }
}

const rtc = new Rtc();

export {rtc as Rtc};