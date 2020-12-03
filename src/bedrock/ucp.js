const dgram = require("dgram");
const util = require("../utils/util");
const bytes = require("../utils/bytes");

const ucpIdHex = "01";
const magicHex = "00ffff00fefefefefdfdfdfd12345678";

function sendUcp(host, port, timeout) {
	var pingStart = Date.now();
    return new Promise((resolve, reject) => {
        try{
		const client = dgram.createSocket("udp4");
        let ok = false;

        function send(message) {
            client.send(message, 0, message.length, port, host, (err, bytes) => {
                if (err) {
                    reject('Socket Error ' + err.errno)
					clearTimeout(timer);
                    client.close();
                }
            });
        }

        client.on("message", (msg, rinfo) => {
            const hex = msg.toString("hex");
            if (!hex.startsWith("1c")) {
                reject('Invalid Data Recieved');
				clearTimeout(timer);
                client.close();
                return;
            }
            const byteLength = parseInt(hex.substr(66, 4), 16);
            const data = hex.substr(70, byteLength * 2);
            var arr = util.hexToString(data).split(";");
			var json = {
			hostname: arr[1],
			version: arr[3],
			latency: Date.now() - pingStart,
			players:{online: arr[4], now: arr[5]}}
			resolve(json)
            ok = true;
			clearTimeout(timer);
            client.close();
        });

        client.on("err", (err) => {
            reject(err);
			clearTimeout(timer);
            client.close();
        });
		
        client.on("close", () => {
            if (!ok) {
             reject("Connection Timed Out");   
            }
        });
		
		var timer = setTimeout(function() { //added by me because it didn't have this because god knows why
			client.close();
		}, timeout);

        const writer = new bytes.ByteWriter();
        writer.writeHex(ucpIdHex);
        writer.writeLong(Date.now());
        writer.writeHex(magicHex);
        send(writer.toBuffer());
		}
		catch(err){reject(err)}
		});
}
module.exports = sendUcp;
