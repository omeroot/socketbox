// @flow
import './foo';
import Dog from './_class';

// LgFoo( { foo : 'foo' } );  // Works!

// $ExpectError
// LgFoo( { bar : 'bar' } ); // Error!

// const tuple: [number, boolean, string] = [1, true, 'three'];
// const none: void = tuple[ 3 ]; // Error!


const dog = new Dog( 10 );
console.log( dog.age );

Dog.totalAnimalCount += 1;
Dog.totalAnimalCount += 1;

console.log( Dog.totalAnimalCount );
