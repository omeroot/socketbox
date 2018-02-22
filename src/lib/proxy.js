// @flow
import { sync } from './utility';

export default class Proxy {
  static mountedPathRequestHandler: Map<string, Array<Function>> = new Map();
  static requestHandler: Array = [];

  static add ( ...funcs: Array<Function> ) {
    if ( !funcs.length ) return false;

    funcs.forEach( ( fn ) => {
      if ( typeof fn !== 'function' ) throw new TypeError( 'use method requires functions' );
      this.requestHandler.push( fn );
    } );

    return funcs.length;
  }

  static callProxyHandlers ( req, res ) {
    return sync( this.requestHandler, req, res );
  }
}
