const util = require("./util");

class ByteWriter {
    constructor(initial) {
        this.data = initial ? initial : "";
    }
    writeLong(value) {
        this.data += util.int64ToHex(value);
    }
    writeInt(value) {
        this.data += util.int32ToHex(value);
    }
    writeShort(value) {
        this.data += util.int16ToHex(value);
    }
    writeByte(value) {
        this.data += util.int8ToHex(value);
    }
    writeBuffer(buf) {
        this.data += buf.toString('hex');
    }
    writeHex(hex) {
        this.data += hex;
    }
    writeVarInt(value) {
        while (true) {
            if ((value & 0xFFFFFF80) == 0) {
                this.writeByte(value);
                return;
            }
            this.writeByte(value & 0x7F | 0x80);
            value >>>= 7;
        }
    }
    toHex() {
        return this.data;
    }
    toBuffer() {
        return Buffer.from(this.data, "hex");
    }
}

class StreamReader {
    constructor(readable) {
        this.r = readable;
    }
    readHex(size) {
        console.log(this.r)
		console.log('-----------------------------------')
		console.log(this.r.read)
		return this.r.read(size).toString("hex");
		   }
    readAsNumber(size) {
        return parseInt(this.readHex(size), 16);
    }
    readByte() {
        return this.readAsNumber(1);
    }
    readShort() {
        return this.readAsNumber(2);
    }
    readUtfVarInt() {
        const length = this.readVarInt();
        const strData = this.readHex(length);
        return util.hexToString(strData);
    }
    readVarInt() {
        let i = 0;
        let j = 0;
        while (true) {
            let k = this.readByte();
            i |= (k & 0x7F) << j++ * 7;
            if (j > 5)
                throw new Error("VarInt too big");
            if ((k & 0x80) != 128)
                break;
        }
        return i;
    }
}

module.exports = { ByteWriter, StreamReader };
