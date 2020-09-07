let g_wss;
// const g_wss = "wss://omnich.net:9090";

const Ws = {
    sock: null,
    webSocketConnect: (wss) => {
        return new Promise(function (resolve, reject) {
            g_wss = wss
            window.WebSocket = window.WebSocket || window.MozWebSocket;
        
            Ws.sock = new WebSocket(g_wss, 'wss-omnich-protocol');
            
            Ws.sock.onopen = function () {
                console.log(`${g_wss}  connected websocket.`);
                resolve();
            }

            Ws.sock.onerror = function () {
                Ws.sock = null;
                console.log("WebSocket Error");
            };
    
            Ws.sock.onclose = function () {
                console.log("WebSocket Closed");
                Ws.sock = null;
            };
    
            Ws.sock.onmessage = function (message) {
                console.log("<< " + JSON.stringify(signal));
                var signal = JSON.parse(message.data);
                // if (signal.cmd == "ANSWER") {
                    //setAnswer(JSON.parse(signal.jsepMsg));
                    // setAnswer(signal.jsepMsg);
                // }
            }
        })
    },
    onopen: () => {
        console.log(g_wss.slice(0,-5) + " connected websocket.");
        resolve();
    },
    onmessage: (message) => {
        console.log("<< " + JSON.stringify(signal));
        var signal = JSON.parse(message.data);
    },
    send_msg: (cmd, from, to, msg) => {
        let msgData = {
            'callType': "WEB2SIP",
            'cmd': cmd,
            'from': from,
            'to': to,
            'domain': "omnich",
            'jsepMsg' : msg
        };
    
        Ws.sock.send(JSON.stringify(msgData));
        console.log(">> " + JSON.stringify(msgData).slice(0,128));
    }
}

export default Ws;