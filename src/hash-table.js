/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax } = require('./hash-table-helpers');

// LimitedArray, and getIndexBelowMax are two tools provided for you in the helper file.
// There are other methods on the LimitedArray class in the './hash-table-helpers' file that you can use for your implementation.

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }
  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    if (this.storage.length / this.limit > 0.75) {
      this.storage.limit *= 2;
      this.limit *= 2;
    }

    const bucketForKey = this.bucket(key, this.limit);
    const currentBucketPairs = this.bucketValues(bucketForKey) || [];


    if (this.retrieve(key)) {
      currentBucketPairs.forEach((pair) => {
        if (pair[0] === key) {
          pair[1] = value;
        }
      });
    } else {
      currentBucketPairs.push([key, value]);
      this.storage.set(bucketForKey, currentBucketPairs);
    }
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const bucketForKey = this.bucket(key, this.limit);
    const values = this.bucketValues(bucketForKey);

    if (values === undefined) return;

    values.forEach((pair) => {
      if (pair[0] === key) {
        pair[0] = undefined;
      }
    });
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const bucketForKey = this.bucket(key, this.limit);
    const values = this.bucketValues(bucketForKey);

    if (values === undefined) return;

    const matchingPair = values.find((pair) => {
      return pair[0] === key;
    });

    if (matchingPair === undefined) return undefined;

    return matchingPair[1];
  }

  bucket(key, limit) {
    return getIndexBelowMax(String(key), limit);
  }

  bucketValues(bucket) {
    return this.storage.get(bucket);
  }
}

module.exports = HashTable;
