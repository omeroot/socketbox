
[![npm version](https://badge.fury.io/js/socketbox.svg)](https://badge.fury.io/js/socketbox)
# Socketbox
Socketbox is real time socket layer framework inspired by express.You can simulate socket messages like as restful request, build router system according to a specific protocol and write middleware to this routers.

```js
import Socketbox from 'socketbox';
// First create your own socket server.
const ws = new WebSocket.Server( { port : 8080 } );

// you give socket server instance to socketbox
const app = new Socketbox();

app.createServer( ws );

//you create router
const router = Socketbox.Router();

//you activate router on this websocket server.
app.use( '/', router );
```

## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 8 or higher is required.

```bash
$ npm install socketbox
```

## Supported socket types
 * Websocket

## Socketbox opts
```js
const app = new Socketbox(opts);
```

Events	 		 | Description
-----------------|------------
`ping`	    	 | (boolean) ping-pong activate, server send ping message automatic
`pingTimeout`    | (number) seconds, ping sending timeout

## Basic text message based ping-pong
##### Your client listen ping text message and reply to this message
```js
// client connect to server
var wsClient = new WebSocket('ws://localhost:8080');

// example Web browser websocket
wsClient.onmessage = function(message){ 
  if(message.data === 'ping') {
    ws2.send('pong')
  }
}
```

##### If your client dont reply ping message, server know client is down and clear client data on system.

## Socketbox client events
```js
app.on(<events>, (client) => {
  console.log(`${client.ip} is connected`);
});
```
Events	 		 | Description
-----------------|------------
`connected`    	 | Emitted client connected
`disconnected`   | Emitted client disconnected

##### Event callback give one parameter, it is client object.

## Client sessions
Your each client have own session object.You can edit session add and remove directly.
You can write data to client session.
```js
// example:
// you validate client and returned user object.You
// can put user to client session.You can access session in each request 
// session everytime stored until client disconnect
router.register( '/validate/token', ( req, res ) => {
  req.session.user = validate(req.body.token); //use session.user on each request
} );
```

## Socket message protocol
You need to adjust some rules while send message to this socket server from client. Your socket message architecture below;

```js
{
  url: 'ws://omer.com/message/write',
  body: {
    to: 'x',
    from: 'y',
    message: 'hi!'
  }
}
```
Property | Description
---------|------------
`url`    | ( required ) your defined url on backend server
`body`   | ( optional ) if you want put data to your message

##### you can put query your url.
```js
{
  url: '/message/get?messageId=11993'
}
```

## Router 
```js
router.register( '/message/write', ( req, res ) => {
  res.send( { statusCode : 200 } );
} );
```
you can use query and params while register route path.
```js
router.register( '/message/write/:userid', ( req, res ) => {
  res.send( { statusCode : 200 } );
} );
```
## Middleware
You can add property to request object on middleware.
```js
const mid1 = ( req, res, next ) => {
  req.user = {};
  req.user.username = 'dmomer';
  next();
};

router.register( '/profile', mid1, ( req, res ) => {
  res.send( req.user );
} );
```

## Channels
You can bind clients to channels.You can send message to channel if you want.

#### Join to channel
**Method: join( cname )**

 - cname `<String>` channel name for join

```js
// if channel is not exist, method create channel.
client.join('channel1');

// ex:
// you can listen join router
router.regiseter('/join?room=223', (req, res) => {
  res.join(req.query.room);
});
```

#### Send message to channel
**Method: sendTo(message, cname)**

 - message `<String>` message content
 - cname    `<String>` channel name to go

```js
res.sendTo({message: x}, 'channel1');
```


## Request
You can use some request properties.
```js
req.body; //you can access message body

// if url is /a/b?keyword=omer
// you can access req.query.keyword (value is omer)
req.query; //this is object

// if url is /a/b/:name
// you can access req.params.name (value is any) 
req.params; //this is object

// if your url is wss://omer.com/p/a/t/h?query=string#hash
req.protocol; //wss:
req.host; //omer.com
req.hostname; //omer.com
req.port; // null
req.path; // /p/a/t/h?query=string
req.href; // wss://omer.com/p/a/t/h?query=string#hash
req.query; // 'query=string'
req.hash; // #hash
```
## Response
##### Actually response object is client reference.
You can put string, json or buffer to message.
```js
res.send(JSON.stringify({name: 'omer'}));

res.send(new Buffer('omer'));
```
