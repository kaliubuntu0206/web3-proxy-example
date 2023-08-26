const Web3 = require('web3.js');
const { HttpsProxyAgent } = require('https-proxy-agent');
const http = require('node:http');
const { createProxy } = require('proxy');

const ETH_RPC = 'https://eth.llamarpc.com';

const HTTP_PROXY_PORT = 3128;
const HTTP_PROXY_HOST = 'localhost';
const HTTP_PROXY = `http://${HTTP_PROXY_HOST}:${HTTP_PROXY_PORT}`;

const web3 = new Web3(new Web3.providers.HttpProvider(ETH_RPC, { agent: { https: new HttpsProxyAgent(HTTP_PROXY) } }));

const sleep = (sec) => new Promise(r => setTimeout(r, sec * 1000));

sleep(2).then(() => web3.eth.getBlockNumber().then(console.log));

/**
 * (Optional) Define new http proxy server (like squid)
 */
let server = http.createServer();

server = createProxy(server);

server.listen(3128, () => {
  var port = server.address().port;
  console.log('HTTP(s) proxy server listening on port %d', port);
});

server.on('connect', (res, socket) => {
  // This is where you could find out that ethers provider will connect RPC via proxy agent
  console.log(`Proxy connection from ${socket.remoteAddress} with headers: ${JSON.stringify(res.rawHeaders)}`);
});