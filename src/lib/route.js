// @flow
import _Router from './router';

export default class Route {
  static routerArray: Array<_Router> = [];

  static routeTo ( req: Object, res: Object ) {
    let targetRouter: ?_Router = null;

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
