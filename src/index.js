const query = require("./bedrock/query")
const ucp = require("./bedrock/ucp")

module.exports = {ping};

//mode 0: Hybrid Mode (default)
//mode 1: Query Only
//mode 2: Ping Only
function ping(host, port, timeout = 5000, mode = 0){
return new Promise(async(resolve, reject) => {
try{
if(mode == 1){ //query only
try{
var data = await query(host, port, timeout);
resolve(data);}
catch(err){reject(err)}}
else if(mode == 2){ //ping only
try{
var data = await ucp(host, port, timeout);
resolve(data);}
catch(err){reject(err);}}
else if(mode == 0){ //hybrid mode with fallback
try{
var data = await query(host, port, timeout);
resolve(data);}
catch(err){	
	try{
	var data = await ucp(host, port, timeout);
	resolve(data);}
	catch(err){reject(err);}}}
}
catch(err){reject(err)}})
}	