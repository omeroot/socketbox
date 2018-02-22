import assert from 'assert';
import Proxy from './../src/lib/proxy';

describe('Proxy', () => {
  describe('add', (done) => {
    it('add empty parameter', (done) => {
      assert(Proxy.add() === false);
      done();
    });

    it('non-function parameters', (done) => {
      assert.throws(() => Proxy.add(1,2,3));
      done();
    });

    it('multiple function', (done) => {
      Proxy.requestHandler = [];
      const result = [];

      const f1 = () => {
        result.push('1');
        return 1;
      }
      const f2 = () => {
        result.push('2');
        return 2;
      }

      Proxy.add(f1,f2);
      assert(Proxy.requestHandler[0]() === 1);
      assert(Proxy.requestHandler[1]() === 2);
      done();
    });

    it('add single function', (done) => {
      Proxy.requestHandler = [];
      Proxy.add(() => {
        done();
      });

      Proxy.callProxyHandlers({},{});
    });
  });

  it('callProxyHandlers', (done) => {
    // clear add functions
    Proxy.requestHandler = [];
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

    Proxy.add(f1,f2);

    Proxy.callProxyHandlers({},{});
  });
});