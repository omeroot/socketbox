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
    if ( arr[ index ] ) {
      try {
        arr[ index ]( req, res, next.bind( null, index + 1 ) );
      } catch ( error ) {
        reject( error );
      }
    }

    approve();
  };

  try {
    arr[ 0 ]( req, res, next.bind( null, 1 ) );
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

    if ( !json.url || !json.url.length ) {
      return new Error( JSON.stringify( { statusCode : 404, error : 'Not found', message : 'url is not defined' } ) );
    }

    req.body = json;
    req.headers = Object.assign( {}, json, { data : undefined } );

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
  if ( !req.isRoutable ) return;

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
};

