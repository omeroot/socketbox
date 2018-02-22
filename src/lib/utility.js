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
