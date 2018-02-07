export function isPromise ( obj ) {
  return !!obj && ( typeof obj === 'object' || typeof obj === 'function' ) && typeof obj.then === 'function';
}

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

export const sync = ( arr, req, res ) => new Promise( ( approve, reject ) => {
  const resultArray  = [];

  if ( !arr.length ) return approve( resultArray );

  const next = ( index ) => {
    if ( arr[ index ] ) {
      arr[ index ]( req, res, next.bind( null, index + 1 ) );
    }

    approve();
  };

  try {
    arr[ 0 ]( req, res, next.bind( null, 1 ) );
  } catch ( error ) {
    console.log( error );
  }

  return true;
} );
