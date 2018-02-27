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
    let matched;

    if ( this.prefixRegExp.test( req.pathname ) ) {
      await sync( this.middleware, req, res );
      matched = await this.callNextFunctions( req, res );
    }

    if ( !matched ) next();
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

  setPrefix ( prefix: string ) {
    this.prefix = prefix;
    this.prefixRegExp = new RegExp( `^${prefix}`, 'i' );
  }

  static runAsyncRequestHandler ( handler: Array<Function>, req: any, res: any ) {
    return sync( handler, req, res );
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

  async callNextFunctions ( req: Request, res: any ) {
    const { pathname } = req;
    const { match, index } = this.findAndGetPathInMap( pathname );

    if ( !match ) {
      return false;
    }

    try {
      await this.constructor.runAsyncRequestHandler( this.mapping[ index.toString() ], req, res );
      req.at_finish = Date.now();

      return true;
    } catch ( error ) {
      console.log( error );
      return false;
    }
  }
}
