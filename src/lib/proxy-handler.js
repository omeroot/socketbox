// @flow
import Router from './router';

export default class ProxyHandler {
  static mountedHandler: Map<string, Router> = new Map();

  static lazyRouter ( path: string ) {
    let _r = this.mountedHandler.get( path );

    if ( !_r ) {
      _r = new Router( path );
      _r.setPrefix( path );

      this.mountedHandler.set( path, _r );
    }

    return _r;
  }

  static dispatch ( _r, to ) {
    to.use( _r.middleware );
    to.setPrefix( _r.prefix );
    this.mountedHandler.set( _r.prefix, to );
  }

  static add ( targetPath: string | Function | Router, fn: Function | Router ) {
    let _fn;
    let path = '/';

    if ( !targetPath ) return false;

    if ( !fn ) {
      _fn = targetPath;
    } else {
      _fn = fn;
      path = targetPath;
    }

    if ( typeof path !== 'string' || !path.length ) throw new TypeError( 'use method path should be string.' );
    if ( typeof _fn !== 'function' && !( _fn instanceof Router ) ) {
      throw new TypeError( 'use method requires function or router instance.' );
    }

    const router = this.lazyRouter( path );

    if ( _fn instanceof Router ) {
      this.dispatch( router, _fn );
      return true;
    }

    if ( typeof _fn === 'function' ) {
      router.use( _fn );
      return true;
    }

    return false;
  }

  static async callProxyHandlers ( req, res ) {
    const iterator = this.mountedHandler.entries();

    const runner = async () => {
      const v = iterator.next();

      if ( !v.done ) {
        const _router = v.value[ 1 ];
        _router.prehandler( req, res, runner );
        return;
      }

      res.send( { statusCode : 404, error : 'Not found', message : 'url is not defined' } );
    };

    runner();
  }
}
