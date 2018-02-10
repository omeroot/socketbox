import assert from 'assert';

import Route from './../src/lib/route';
import Router from './../src/lib/router';

describe( 'Route', ( done ) => {
  it( 'Activate router', ( done ) => {
    const router = new Router();

    Route.activateRouter( router );
    assert( Route.routerArray[ 0 ] instanceof Router );
    done();
  } );

  it( 'routeTo router prefix statusCode 200', ( done ) => {
    const router = new Router();
    router.setPrefix( '/api/v1' );
    router.register( '/user/profile', (req, res) => {
      done();
    } );

    // clear Route
    Route.routerArray = [];
    Route.activateRouter( router );


    const req = {
      pathname : '/api/v1/user/profile',
    };
    const res = {};

    Route.routeTo( req, res );
  } );

  it( 'routeTo router prefix statusCode 404', ( done ) => {
    const router = new Router();
    router.setPrefix( '/api/v1' );
    router.register( '/user/profile', () => {} );

    Route.routerArray = [];
    Route.activateRouter( router );

    const req = {
      path : '/api/v2/user/profile',
    };
    const res = {
      send : ( response ) => {
        assert( response.statusCode === 404 );
        done();
      },
    };

    Route.routeTo( req, res );
  } );
} );
