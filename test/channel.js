import assert from 'assert';
import WebSocket from 'ws';
import http from 'http';
import net from 'net';

import Client from './../src/lib/client';
import Channel from './../src/lib/channel';

describe( 'Channel', () => {
  describe( 'Create', () => {
    it( 'Create Channel', ( done ) => {
      Channel.createChannel( 'room1' );
      assert( Channel.channels.room1.length === 0 );
      done();
    } );

    it( 'Create already registered', () => {
      assert.throws( () => Channel.createChannel( 'room1' ) );
    } );
  } );

  describe( 'Channel connection', () => {
    it( 'Join Channel', ( done ) => {
      const server = http.createServer();

      server.listen( 7712, () => {
        Channel.createChannel( 'room2' );
        const socket = net.Socket( {
          allowHalfOpen : true,
        } );
        const req = new http.IncomingMessage( socket );

        socket.connect( 7712 );
        socket.on( 'connect', () => {
          const client = new Client( socket, req );
          client.join( 'room2' );
          server.close();
          done();
        } );
      } );
    } );

    it('Join duplicate', (done) => {
      // virtual req object
      var req = {connection: {remoteConnection: '::1'}};
      var c = new Client(net.Socket(), req);
      c.join('room3');
      assert.strictEqual(c.join('room3'), false);
      done();
    })

    it( 'Publish', ( done ) => {
      const wServer = new WebSocket.Server( { port : 7711 } );
      let counter = 0;
      let connectionCounter = 0;

      wServer.on( 'connection', ( socket, req ) => {
        const c = new Client( socket, req );
        c.join( 'room3' );
        connectionCounter += 1;
        if ( connectionCounter === 2 ) {
          Channel.publish( 'hi', 'room3' );
        }
      } );

      const s1 = new WebSocket( 'ws://localhost:7711' );
      const s2 = new WebSocket( 'ws://localhost:7711' );

      const handle = ( message ) => {
        assert.strictEqual( message, 'hi' );
        counter += 1;
        if ( counter === 2 ) {
          wServer.close( done );
        }
      };

      s1.on( 'message', handle );
      s2.on( 'message', handle );
    } );
  } );
} );
