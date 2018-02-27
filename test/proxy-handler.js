import assert from 'assert';
import ProxyHandler from './../src/lib/proxy-handler';

describe('ProxyHandler', () => {
  describe('add', (done) => {
    it('add empty parameter', (done) => {
      assert(ProxyHandler.add() === false);
      done();
    });

    it('non-function parameters', (done) => {
      assert.throws(() => ProxyHandler.add(1,2,3));
      done();
    });

    it('multiple function', (done) => {
      ProxyHandler.requestHandler = [];
      const result = [];

      const f1 = () => {
        result.push('1');
        return 1;
      }
      const f2 = () => {
        result.push('2');
        return 2;
      }

      ProxyHandler.add(f1,f2);
      assert(ProxyHandler.requestHandler[0]() === 1);
      assert(ProxyHandler.requestHandler[1]() === 2);
      done();
    });

    it('add single function', (done) => {
      ProxyHandler.requestHandler = [];
      ProxyHandler.add(() => {
        done();
      });

      ProxyHandler.callProxyHandlers({},{});
    });
  });

  it('callProxyHandlers', (done) => {
    // clear add functions
    ProxyHandler.requestHandler = [];
    const result = [];

    const f1 = (req, res, next) => {
      result.push('1');
      next();
    }

    const f2 = (req, res, next) => {
      result.push('2');
      assert(result[0] === '1');
      assert(result[1] === '2');
      done();
    }

    ProxyHandler.add(f1);
    ProxyHandler.add(f2);

    ProxyHandler.callProxyHandlers({
      isRoutable: false
    },{});
  });
});