function padHex(hex, bytes) {
    return ("00".repeat(bytes) + hex).substr(-(bytes * 2));
}
function padHexEnd(hex, bytes) {
    return (hex + "00".repeat(bytes)).substring(0, bytes * 2);
}
function int64ToHex(value) {
    return padHex(value.toString(16), 8);
}
function int32ToHex(value) {
    return padHex(value.toString(16), 4);
}
function int16ToHex(value) {
    return padHex(value.toString(16), 2);
}
function int8ToHex(value) {
    return padHex(value.toString(16), 1);
}

function eachCharsFromString(str, n) {
    const value = `${str}`;
    const chrs = parseInt(n);
    const array = [];
    for (let i = 0; i < (value.length / chrs); i++) {
        array.push(value.substring(i * chrs, (i + 1) * chrs));
    }
    return array;
}

function hexToString(hex) {
    return Buffer.from(hex, "hex").toString("utf-8");
}

module.exports = {
    int32ToHex, int8ToHex, padHex, eachCharsFromString,
    hexToString, padHexEnd, int64ToHex, int16ToHex
};
