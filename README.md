# Horn
Horn is real time socket layer framework inspired by express.You can simulate socket messages like as restful request, build router system according to a specific protocol and write middleware to this routers.

```js
import Socketbox from 'socketbox';
// First create your own socket server.
const ws = new WebSocket.Server( { port : 8080 } );

// you give socket server instance to socketbox
Socketbox.createServer( ws );

//you create router
const router = Socketbox.Router();

//you activate router on this websocket server.
Socketbox.use( '/', router );
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

you can put query your url.
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
```
const mid1 = ( req, res, next ) => {
  req.user = {};
  req.user.username = 'dmomer';
  next();
};

router.register( '/profile', mid1, ( req, res ) => {
  res.send( req.user );
} );
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
You can put string, json or buffer to message.
```js
res.send(JSON.stringify({name: 'omer'}));

res.send(new Buffer('omer'));
```
