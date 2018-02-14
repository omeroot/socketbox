import assert from 'assert';
import net from 'net';

import Cache from './../src/lib/cache';
import Client from './../src/lib/client';

describe('Cache', () => {
  it('sPush method', (done) => {
    const client = new Client(net.Socket(), {connection: {remoteAddress: '::1'}});
    client.session.dbId = '00110011';

    const uuid = client.__uid__;

    Cache.sPush(uuid, client);

    const cOnCache = Cache.clientsMap.get(uuid);
    assert(cOnCache instanceof Client);
    assert(cOnCache.__uid__ === uuid);
    assert(cOnCache.session.dbId === '00110011');

    done();
  });

  it('sGet method', (done) => {
    const client = new Client(net.Socket(), {connection: {remoteAddress: '::1'}});
    client.session.dbId = '00110012';

    const uuid = client.__uid__;
    Cache.sPush(uuid, client);
    
    const cOnCache = Cache.sGet(uuid);

    assert(cOnCache instanceof Client);
    assert(cOnCache.__uid__ === uuid);
    assert(cOnCache.session.dbId === '00110012');

    done();
  });

  it('Get clients method', (done) => {
    const clientsArr = Cache.clients();

    console.log(clientsArr);

    assert(clientsArr.length === 2);
    assert(clientsArr[0].session.dbId === '00110011');
    assert(clientsArr[1].session.dbId === '00110012');

    done();
  });

  it('clearClient method', (done) => {
    const client = new Client(net.Socket(), {connection: {remoteAddress: '::1'}});
    client.session.dbId = '00110013';

    const uuid = client.__uid__;
    Cache.sPush(uuid, client);

    Cache.clearClient(uuid);

    const c = Cache.sGet(uuid);

    assert(typeof c === 'undefined');
    done();
  });

  describe('Cache Filter', () => {
    it('filter null arguments', (done) => {
      const filtered = Cache.filter();
      assert(filtered.length === 0);

      done();
    });

    it('filter with key', (done) => {
      const client = new Client(net.Socket(), {connection: {remoteAddress: '::1'}});
      client.session.dbId = '00110014';
  
      const uuid = client.__uid__;
      Cache.sPush(uuid, client);

      const filtered = Cache.filter(uuid);

      assert(filtered.length === 1);
      assert(filtered[0].session.dbId === '00110014');

      done();
    });

    it('filter with function', (done) => {
      const filtered = Cache.filter((item) => {
        // 0. index is key
        // 1. index is value
        return item[1].session.dbId === '00110014';
      });

      assert(filtered.length === 1);
      assert(filtered[0].session.dbId === '00110014');
      done();
    });
  })
})


