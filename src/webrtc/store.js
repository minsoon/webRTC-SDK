let LocalId
let RemoteId = []
let Stream
let Devices
let Sdp

const setLocalId = (id) => {
    LocalId = id
}
const setRemoteId = (id) => {
    RemoteId.push(id)
}
const setStream = (stream) => {
    Stream = stream
}
const setDevices = (data) => {
    Devices = data
}
const setSdp = (data) => {
    Sdp = data
}

const getLocalId = () => {
    return LocalId
}
const getRemoteId = () => {
    return RemoteId
}
const getStream = () => {
    return Stream
}
const getDevices = () => {
    return Devices
}
const getSdp = (data) => {
    return Sdp
}


export default {
    setLocalId,
    setRemoteId,
    getLocalId,
    getRemoteId,
    setStream,
    getStream,
    setDevices,
    getDevices,
    setSdp,
    getSdp
}