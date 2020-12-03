# statplus
Node.js library for pinging Bedrock Edition Minecraft servers.

This library is originally forked from [mc-ping.lesmi](https://github.com/nao20010128nao/mc-ping.lesmi)

## Features
- Retrieve detailed information on Bedrock Minecraft servers
	-Name
	-Version
	-Player Online and Max count
	-List of online players (supported servers)

## Usage
```javascript
const api = require(statplus);

async function pingServer(){
try{
var data = await api.ping(ip, port, timeout, mode) //JSON data from server
}
catch(err){console.log(err)} //Server offline
}
```
Arguments: 
ip - IP address or hostname of Minecraft server
port - Port number of Minecraft server
timeout (optional) - Number of milliseconds before rejecting promise if no data is returned (Default is 5000)
mode (optional) - Type of ping to preform (Default is 0)
	0 - Hybrid Mode: Will first attempt to query server for detailed information, if fails will attempt basic ping. This is the most reliable option, but is slower.
	1 - Query Only: Will only attempt to use the more advenced query function. Returns more data but is slower.
	2- Ping Only: Will only attempt a basic ping on the server. Returns less information but might be faster for very large servers.
