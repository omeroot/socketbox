// @flow
import { parse as URLparse, URL } from 'url';
import _Router from './router';
import { PreRequest } from './types';

export default class Route {
  static routerArray: Array<_Router> = [];

  static queryParser ( messageObject: Object ) {
    const urlObject = new URL( messageObject.url );
    const query = {};

    urlObject.searchParams.forEach( ( value, name ) => {
      query[ name ] = value;
    } );

    return query;
  }

  static routeTo ( req: PreRequest, res: Object ) {
    // ojb contains session,payloadJSON,at_started at this time
    const urlDelegate = URLparse( req.payloadJSON.url );
    const obj = Object.assign( urlDelegate, req );
    let targetRouter: ?_Router = null;

    // rest of body
    obj.headers = Object.assign( {}, req.payloadJSON, { body : undefined } );

    /**
     * url query variables convert to object
     * ?a=b&c=d --> {a: b, c: d}
     */
    obj.query = this.queryParser( req.payloadJSON );

    for ( let i = 0; i < this.routerArray.length; i += 1 ) {
      if ( this.routerArray[ i ].prefixRegExp.test( req.pathname ) ) {
        targetRouter = this.routerArray[ i ];
        break;
      }
    }

    if ( targetRouter ) {
      return targetRouter.callNextFunctions( req, res );
    }

    return res.send( { statusCode : 404 } );
  }

  static activateRouter ( routerRef: Object ) {
    this.routerArray.push( routerRef );
  }
}
