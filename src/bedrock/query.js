const dgram = require("dgram");
const request = require("./query-request");
const util = require("../utils/util");

// this value is constant; specified in protocol
const sessionId = 1;
const States = {
    HANDSHAKE: "handshake",
    WAITING: "waiting"
};

const dbg = () => { };

const idHandshake = 9;
const idStat = 0;

function sendQuery(host, port, timeout = 5000) {
	var pingStart = Date.now();
    return new Promise((resolve, reject) => {
		try{
        const client = dgram.createSocket("udp4");
        let state = States.HANDSHAKE;
        let token = null;
        let ok = false;
        dbg("socket ready");

        var timer = setTimeout(function() {
		reject('Connection Timed Out');
		client.close();
		}, timeout);
		
		function send(message) {
            dbg("data " + message.toString("hex"));
            client.send(message, 0, message.length, port, host, (err, bytes) => {
                dbg(`sent ${err} ${bytes}`);
                if (err) {
                    reject('Socket Error: ' + err);
					clearTimeout(timer);
                    client.close();
                }
            });
        }

        client.on("message", (msg, rinfo) => {
            dbg("received: " + state + " " + msg.toString("hex"));
            switch (state) {
                case States.HANDSHAKE: {
					console.log('handshake')
                    // when we received handshake result;
                    // get token from message
                    const message = msg.toString("hex");
					console.log(message)
                    if (message.substring(0, 10).toLowerCase() != "0900000001") {
                        reject("illegal handshake: " + message.substring(0, 10));
						clearTimeout(timer);
                        client.close();
                        return;
                    }
                    token = parseInt(util.hexToString(message.substring(10, message.length - 2)));
                    state = States.WAITING;
                    dbg("token " + token);
                    fullStat();
                    break;
                }
                case States.WAITING: {
					console.log('data recieved')
                    // when we received the content
                    resolve(parseQuery(msg, Date.now() - pingStart));
                    ok = true;
					clearTimeout(timer);
                    client.close();
                    break;
                }
            }
        });

        client.on("err", (err) => {
            dbg("error triggered");
            reject(err);
			clearTimeout(timer);
            client.close();
        });

        client.on("close", () => {
			console.log('closed')
            dbg("closed");
            if (!ok) {
				clearTimeout(timer);
                reject("No result");
            }
        });

        function fullStat() {
            dbg("full stat");
            const fullStatBuffer = new request.QueryRequest(idStat)
                .setSessionId(sessionId)
                .setPayload(Buffer.from(util.int32ToHex(token) + "00000000", "hex"))
                .toBuffer();
            send(fullStatBuffer);
        }

        dbg("sending handshake");
        const handshakeBuffer = new request.QueryRequest(idHandshake)
            .setSessionId(sessionId)
            .toHex();
        const padded = Buffer.from(handshakeBuffer + "00000000", "hex");
        send(padded);
    } catch(err){
	// add try catch
	}
	});
}

function parseQuery(buf, latency) {
const hex = (buf.toString("hex") + "").toLowerCase();
var bits = []
for (i = 10; i < hex.length; i = i + 2) {
let splitStr = hex.slice(i, i + 2)
bits.push(splitStr)}
var splt = bits.join(' ').split('00');
var clean = []
for(i = 2; i < splt.length; i++){
clean.push(Buffer.from(splt[i].replace(/ /g, ''), "hex").toString())
}
var playerlist = [];
var p = clean.indexOf('\x01player_') + 2;
while(clean[p] !== ''){
playerlist.push(clean[p])
p++;}
var data ={
'hostname': clean[clean.indexOf('hostname') + 1],
'hostip': clean[clean.indexOf('hostip') + 1],
'gametype': clean[clean.indexOf('gametype') + 1],
'hostport': clean[clean.indexOf('hostport') + 1],
'map': clean[clean.indexOf('map') + 1],
'version': clean[clean.indexOf('version') + 1],
'game_id': clean[clean.indexOf('game_id') + 1],
'latency': latency,
'players':{
	'online': clean[clean.indexOf('numplayers') + 1],
	'max': clean[clean.indexOf('maxplayers') + 1],
	'list': playerlist}}
return data;
}

module.exports = sendQuery;
