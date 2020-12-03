const util = require("../utils/util");
const bytes = require("../utils/bytes");

const idHandshake = 9;
const idStat = 0;

const magic = "fefd";

class QueryRequest {
    constructor(type) {
        this.type = type;
        this.sessionId = 0;
        this.payload = Buffer.from("", "hex");
    }
    setSessionId(value) {
        this.sessionId = parseInt(value);
        return this;
    }
    getSessionId() {
        return this.sessionId;
    }
    setPayload(payload) {
        if (!(payload instanceof Buffer)) {
            throw new Error("Not a buffer: " + payload);
        }
        this.payload = payload;
        return this;
    }
    getPayload() {
        if (this.type == idHandshake) {
            return Buffer.from("", "hex");
        } else {
            return this.payload;
        }
    }
    toHex() {
        let writer = new bytes.ByteWriter();
        writer.writeHex(magic);
        writer.writeByte(this.type);
        writer.writeInt(this.sessionId);
        writer.writeBuffer(this.getPayload());
        return writer.toHex();
    }
    toBuffer() {
        return Buffer.from(this.toHex(), "hex");
    }
}

module.exports = { QueryRequest, idHandshake, idStat }
