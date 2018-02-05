// @flow
/**
 * @File   : _class.js
 * @Author : {omer demircan}
 * @Date   : 2018-2-5 16:20:18
 */

class Animal {
  age: number = 0;
  static totalAnimalCount = 0;
}

class Dog extends Animal {
  constructor ( age: number ) {
    super();

    this.age = age;
  }
}

export default Dog;
