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
