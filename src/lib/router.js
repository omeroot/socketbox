// @flow
import pathToRegexp from 'path-to-regexp';
import path from 'path';
import { sync } from './utility';
import Request from './request';

export default class Router {
  /**
   * Used for check url in each request,
   * match regex in this array.
   */
  routePathRegex: Array<RegExp> = [];

  /**
   * for check already registered raw path string
   */
  routePath: Array<string> = [];

  /**
   * router path handle functions map
   * index is position in routePathIndex of path
   */
  mapping: {[index: string]: Array<Function>} = {};

  /**
   * Router default prefix and prefix regex.
   */
  prefix: string
  prefixRegExp: RegExp;

  /**
   * array, there called with app.use
   *
   * @type {Array<Function>}
   * @memberof Router
   */
  middleware: Array<Function> = [];

  constructor ( prefix: string ) {
    this.setPrefix( ( prefix && prefix.length ) ? prefix : '/' );
  }

  async prehandler ( req, res, next ): number {
    if ( this.prefixRegExp.exec( req.pathname ) ) {
      await sync( this.middleware, req, res );
      const matched = await this.callNextFunctions( req, res );

      if ( !matched ) next();
    }
  }

  use ( fn ) {
    if ( Array.isArray( fn ) ) {
      fn.forEach( ( func ) => {
        if ( typeof func === 'function' ) return this.middleware.push( func );
        throw new TypeError( 'router use item should be function' );
      } );

      return;
    }

    if ( typeof fn === 'function' ) {
      this.middleware.push( fn );
      return;
    }

    throw new TypeError( 'router use argument is invalid' );
  }

  register ( _path: string, ...args: Array<Function> ) {
    if ( typeof _path !== 'string' ) throw new Error( `path is invalid type. [${_path}]` );
    if ( !args.length ) throw new Error( `Handle function is not defined path=[${_path}]` );

    const fullpath = path.join( this.prefix, _path.toLowerCase() );
    const pathIsRegexed = pathToRegexp( fullpath );

    let index: number = this.routePath.indexOf( fullpath );

    if ( index < 0 ) {
      this.routePath.push( fullpath );
      index = this.routePathRegex.push( pathIsRegexed ) - 1;
      this.mapping[ index.toString() ] = args;
    } else {
      this.mapping[ index.toString() ] = this.mapping[ index.toString() ].concat( args );
    }

    return true;
  }

  setPrefix ( prefix: string, opts: Object ) {
    this.prefix = prefix;
    this.prefixRegExp = pathToRegexp( prefix, [], opts || {
      sensitive : true,
      strict    : false,
      end       : false,
    } );
  }

  findAndGetPathInMap ( pathnameOnReq ) {
    let match: any = null;
    let index: number = 0;

    for ( let i  = 0; i < this.routePathRegex.length; i += 1 ) {
      match = this.routePathRegex[ i ].exec( pathnameOnReq );
      index = i;
      if ( match ) break;
    }

    return { match, index };
  }

  callNextFunctions ( req: Request, res: any ) {
    return new Promise( async ( resolve, reject ) => {
      const { pathname } = req;
      const { match, index } = this.findAndGetPathInMap( pathname );

      if ( !match ) {
        resolve( false );
        return;
      }

      try {
        await sync( this.mapping[ index.toString() ], req, res );
      } catch ( error ) {
        reject( error );
      }
    } );
  }
}
