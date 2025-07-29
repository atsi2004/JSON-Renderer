function isPrimitive(value: any): boolean { // To be shown in a DataGrid as a key-value pair

    return( // Returns true if the value is a primitive type
        value === null ||
        typeof value === 'string' || 
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined'
    );
}

function isObject(value: any): boolean { // To be shown in an Accordion as a nested object
  return value && typeof value === 'object' && !Array.isArray(value); // Checking if value is true, an object, and not an array
}

function isArrayOfObjects(arr: any): boolean { // To be shown in an Accordion as an array of nested objects
  return Array.isArray(arr) && arr.every((item) => isObject(item)); // Checking if value is an array and every item is an object
}

export { isPrimitive, isObject, isArrayOfObjects }; // Exporting the functions for use in other components