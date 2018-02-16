import assert from 'assert';
import net from 'net';
import Client from './../src/lib/client';

describe('Client', () => {
  it('SerializeMessage message type =string', (done) => {
    var message = Client.serializeMessage('omer');

    assert(message === 'omer');
    done();
  });

  it('SerializeMessage message type =json', (done) => {
    var message = Client.serializeMessage({name: 'omer'});
    
    assert(message === JSON.stringify({name: 'omer'}));
    done();
  });

  it('SerializeMessage message type =number', (done) => {
    var message = Client.serializeMessage(4);
    
    assert(message === '4');
    done();
  });

  it('SerializeMessage message type =boolean', (done) => {
    var message = Client.serializeMessage(true);
    
    assert(message === 'true');
    done();
  });

  it('Heartbeat', (done) => {
    var req = {connection: {remoteConnection: '::1'}};
    var socket = net.Socket();
    socket.terminate = () => {};

    const c = new Client( socket, req );

    c.isAlive = false;
    assert(c.isAlive === false);
    c.heartbeat();
    assert(c.isAlive === true);
    done();
  });

  it('setIsAlive', (done) => {
    var req = {connection: {remoteConnection: '::1'}};
    var socket = net.Socket();
    socket.terminate = () => {};

    const c = new Client( socket, req );

    c.setIsAlive(false);
    assert(c.isAlive === false);
    c.setIsAlive(true);
    assert(c.isAlive === true);
    done();
  });

  it('getIsAlive', (done) => {
    var req = {connection: {remoteConnection: '::1'}};
    var socket = net.Socket();
    socket.terminate = () => {};

    const c = new Client( socket, req );

    assert(c.getIsAlive() === true);
    done();
  });
});