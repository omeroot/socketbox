import assert from 'assert';
import Request from './../src/lib/request';

describe('Request', () => {
  it('Instance', (done) => {
    const req = new Request('socketbox');
    assert(req.session === undefined);
    assert(req.headers === undefined);
    assert(req.body === undefined);
    assert(req.rawMessage === 'socketbox');
    assert.deepEqual(req.params, {});
    assert.deepEqual(req.query, {});
    assert(req.isRoutable === true);
    assert(req.pathname === '/');
    assert(req.href === undefined);
    assert(req.hostname === undefined);
    done();
  });

  // describe('set Headers', () => {
  //   let req;
    
  //   before((done) => {
  //     req = new Request('socketbox');
  //     done();
  //   });

  //   it('No key', (done) => {
  //     assert.throws(() => req.setHeaders(null, '1'));
  //     done();
  //   });

  //   it('No value', (done) => {
  //     assert.throws(() => req.setHeaders('1'));
  //     done();
  //   });

  //   it('Key is not string', (done) => {
  //     assert.throws(() => req.setHeaders(2, '1'));
  //     done();
  //   });

  //   it('Value is not string', (done) => {
  //     assert.throws(() => req.setHeaders('1', 44));
  //     done();
  //   });

  //   it('Set header success', (done) => {
  //     req.setHeaders('cookie', 'last=omer');
  //     assert(req.headers.hasOwnProperty('error') === true);
  //     assert(req.headers['cookie'] === 'last=omer');
  //     done();
  //   });
  // })
});