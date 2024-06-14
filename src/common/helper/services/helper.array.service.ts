import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { IHelperArrayService } from 'src/common/helper/interfaces/helper.array-service.interface';
import { IHelperArrayRemove } from 'src/common/helper/interfaces/helper.interface';

@Injectable()
export class HelperArrayService implements IHelperArrayService {
  getLeftByIndex<T>(array: T[], index: number): T {
    return _.nth(array, index);
  }

  getRightByIndex<T>(array: T[], index: number): T {
    return _.nth(array, -Math.abs(index));
  }

  /**
   * @param array
   * @param length
   * this exemple how this function work
   * const array = [1, 2, 3, 4, 5];
   * const firstTwoElements = getLeftByLength(array, 2);
   * console.log(firstTwoElements); // Output: [1, 2]
   *
   * const firstThreeElements = getLeftByLength(array, 3);
   * console.log(firstThreeElements); // Output: [1, 2, 3]
   *
   * const allElements = getLeftByLength(array, array.length);
   * console.log(allElements); // Output: [1, 2, 3, 4, 5]
   */
  getLeftByLength<T>(array: T[], length: number): T[] {
    return _.take(array, length);
  }

  getRightByLength<T>(array: T[], length: number): T[] {
    return _.takeRight(array, length);
  }

  getLast<T>(array: T[]): T {
    return _.last(array);
  }

  getFirst<T>(array: T[]): T {
    return _.head(array);
  }

  /**
   * This function is used to get the index of the first occurrence of a given value in an array.
   * For example, if the array is [1,2,3,4,5] and value is 3, it will return 2.
   * @param array
   * @param value
   */
  getFirstIndexByValue<T>(array: T[], value: T): number {
    return _.indexOf(array, value);
  }

  /**
   * This function is used to get the index of the last occurrence of a given value in an array
   * For example, if the array is [1,2,3,4,5,2,2] and value is 2, it will return 6
   * (the index of the last occurrence of 2 in the array)
   * @param array
   * @param value
   */
  getLastIndexByValue<T>(array: T[], value: T): number {
    return _.lastIndexOf(array, value);
  }

  /**
   * const numbers = [1, 2, 3, 4, 5, 3, 6];
   * const result = removeByValue(numbers, 3);
   * console.log(result.removed); // [3, 3]
   * console.log(result.arrays); // [1, 2, 4, 5, 6]
   * @param array
   * @param value
   */
  removeByValue<T>(array: T[], value: T): IHelperArrayRemove<T> {
    const removed = _.remove(array, function (n) {
      return n === value;
    });

    return { removed, arrays: array };
  }

  /**
   * In this example, we're calling the removeLeftByLength function with
   * an array of colors ["red", "orange", "yellow", "green", "blue"]
   * and a length of 3. The function uses Lodash's drop() method to remove
   * the first 3 elements of the array, which are "red", "orange" and "yellow".
   * The remaining elements are returned in the result array, which is ["yellow", "green", "blue"].
   * @param array
   * @param length
   */
  removeLeftByLength<T>(array: T[], length: number): T[] {
    return _.drop(array, length);
  }

  removeRightByLength<T>(array: Array<T>, length: number): T[] {
    return _.dropRight(array, length);
  }

  /**
   * const words = ["Hello", "world"];
   * const result = joinToString(words, " ");
   * console.log(result); // "Hello world"
   * @param array
   * @param delimiter
   */
  joinToString<T>(array: Array<T>, delimiter: string): string {
    return _.join(array, delimiter);
  }

  /**
   * const numbers = [1, 2, 3, 4, 5];
   * const result = reverse(numbers);
   * console.log(result); // [5, 4, 3, 2, 1]
   * @param array
   */
  reverse<T>(array: T[]): T[] {
    return _.reverse(array);
  }

  /**
   * const numbers = [1, 2, 2, 3, 4, 4, 5, 5, 5];
   * const result = unique(numbers);
   * console.log(result); // [1, 2, 3, 4, 5]
   * @param array
   */
  unique<T>(array: T[]): T[] {
    return _.uniq(array);
  }

  /**
   * The function returns a new array containing the elements in a randomized order.
   * const numbers = [1, 2, 3, 4, 5];
   * const result = shuffle(numbers);
   * console.log(result); // e.g [4,1,3,5,2]
   * @param array
   */
  shuffle<T>(array: T[]): T[] {
    return _.shuffle(array);
  }

  /**
   * const a = [1, 2, 3];
   * const b = [4, 5, 6];
   * const result = merge(a, b);
   * console.log(result); // [1, 2, 3, 4, 5, 6]
   * @param a
   * @param b
   */
  merge<T>(a: T[], b: T[]): T[] {
    return _.concat(a, b);
  }

  /**
   * const a = [1, 2, 3, 2];
   * const b = [4, 5, 6, 2, 3];
   * const result = mergeUnique(a, b);
   * console.log(result); // [1, 2, 3, 4, 5, 6]
   * @param a
   * @param b
   */
  mergeUnique<T>(a: T[], b: T[]): T[] {
    return _.union(a, b);
  }

  /**
   * const numbers = [1, 2, 3, 4, 5, 3, 6];
   * const result = filterIncludeByValue(numbers, 3);
   * console.log(result); // [3, 3]
   * @param array
   * @param value
   */
  filterIncludeByValue<T>(array: T[], value: T): T[] {
    return _.filter(array, (arr) => arr === value);
  }

  /**
   * const numbers = [1, 2, 3, 4, 5, 3, 6];
   * const result = filterNotIncludeByValue(numbers, 3);
   * console.log(result); // [1, 2, 4, 5, 6]
   * @param array
   * @param value
   */
  filterNotIncludeByValue<T>(array: T[], value: T): T[] {
    return _.without(array, value);
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let array2 = [3, 4, 5, 6, 7];
   * let result = filterNotIncludeUniqueByArray(array1, array2);
   * console.log(result);
   * In this example, result would be the array [1, 2],
   * @param a
   * @param b
   */
  filterNotIncludeUniqueByArray<T>(a: T[], b: T[]): T[] {
    return _.xor(a, b);
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let array2 = [3, 4, 5, 6, 7];
   * let result = filterIncludeUniqueByArray(array1, array2);
   * console.log(result);
   * In this example, result would be the array [3, 4, 5],
   * @param a
   * @param b
   */
  filterIncludeUniqueByArray<T>(a: T[], b: T[]): T[] {
    return _.intersection(a, b);
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let array2 = [1, 2, 3, 4, 5];
   * let result = equals(array1, array2);
   * console.log(result);
   * In this example, result would be true,
   * @param a
   * @param b
   */
  equals<T>(a: T[], b: T[]): boolean {
    return _.isEqual(a, b);
  }

  notEquals<T>(a: T[], b: T[]): boolean {
    return !_.isEqual(a, b);
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let array2 = [3, 4, 5, 6, 7];
   * let result = in(array1, array2);
   * console.log(result);
   * In this example, result would be true, because there are common elements in array1 and array2
   * @param a
   * @param b
   */
  in<T>(a: T[], b: T[]): boolean {
    return _.intersection(a, b).length > 0;
  }

  notIn<T>(a: T[], b: T[]): boolean {
    return _.intersection(a, b).length == 0;
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let element = 3;
   * let result = includes(array1, element);
   * console.log(result);
   * In this example, result would be true, because the element 3 is present in the array array1
   * @param a
   * @param b
   */
  includes<T>(a: T[], b: T): boolean {
    return _.includes(a, b);
  }

  /**
   * let array1 = [1, 2, 3, 4, 5];
   * let size = 2;
   * let result = chunk(array1, size);
   * console.log(result);
   * n this example, result would be [[1, 2], [3, 4], [5]],
   * because the array is broken down into chunks of size 2.
   * @param a
   * @param size
   */
  chunk<T>(a: T[], size: number): T[][] {
    return _.chunk<T>(a, size);
  }
}
