// @flow

import { URL } from 'url';

export const randomString   = ( _length ) => {
  let length;

  if ( !_length ) length = 12;
  else length = _length;

  const s   = '0123456789';
  const arr = new Array( length );

  return arr.join()
    .split( ',' )
    .map( () => s.charAt( Math.floor( Math.random() * s.length ) ) )
    .join( '' );
};

// TODO: result array fill
export const sync = ( arr, req, res ) => new Promise( ( approve, reject ) => {
  const resultArray  = [];

  if ( !arr.length ) return approve( resultArray );

  const next = ( index ) => {
    ++index;

    if ( arr[ index ] ) {
      try {
        arr[ index ]( req, res, next.bind( null, index ) );
        return;
      } catch ( error ) {
        console.log( error );
        reject( error );
      }
    }

    approve();
  };

  try {
    arr[ 0 ]( req, res, next.bind( arr[ 0 ], 0 ) );
  } catch ( error ) {
    reject( error );
  }

  return true;
} );


/**
 *
 * Check message and convert message to Object
 *
 * @param {Request} req
 * @param {Client} res
 * @param {Function} next
 */
export const deserialize = ( req, res, next ) => {
  try {
    const json = JSON.parse( req.rawMessage );

    req.body = json.body;
    req.headers = Object.assign( {}, json, { body : undefined } );

    return next();
  } catch ( e ) {
    req.isRoutable = false;
    return next();
  }
};

export const pingPong = ( req, res, next ) => {
  if ( req.rawMessage === 'pong' ) {
    res.heartbeat();
    return;
  }

  next();
};

export const urlParser = ( req, res, next ) => {
  if ( !req.isRoutable ) return false;

  const urlObject = new URL( req.headers.url );

  /**
     * url query variables convert to object
     * ?a=b&c=d --> {a: b, c: d}
     */
  urlObject.searchParams.forEach( ( value, name ) => {
    req.query[ name ] = value;
  } );

  req.pathname = urlObject.pathname;
  req.hostname = urlObject.hostname;
  req.href = urlObject.href;

  next();
  return true;
};

/**
 * @param {any} res
 * @param {Function} afterSent
 */
export const onFinished = ( res, afterSent: Function ) => {
  const _fn = res.send;

  res.send = function send ( ...args ) {
    _fn.apply( _fn, args );
    afterSent();
  };
};

