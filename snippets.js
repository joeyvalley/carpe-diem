
// SORTING FUNCTION
const selectionsSorted = [];
let lowest = 0;
let highest = 0;

for (let i = 0; i < entriesNum; i++) {
  let currYear = selections[i].year; // Set currYear to the currently selected year.

  // If this is not the first iteration of the loop, do our comparisons.
  if (selectionsSorted.length !== 0) {
    // If currYear is before the earliest year we've seen so far, add it 
    // to the front of the array and set our lowest comparator to currYear.
    if (currYear < lowest) {
      selectionsSorted.unshift(currYear); // Add currYear to the front of the sorted array since it is the lowest value thus far.
      lowest = currYear; // Set our lowest year tracker to currYear.
    }
    // If currYear is after the latest year we've seen so fasr, add it
    // to the end of the array and set our highest comparator to currYear
    else if (currYear > highest) {
      selectionsSorted.push(currYear); // Add currYear to the back of the sorted array since it is the highest value thus far.
      highest = currYear; // Set our highest year tracker to currYear.
    }
    // If currYear is neither lowest nor highest, insert it into the selectionsSorted array at the correct place.
    else {
      // Loop through the sorted array as it currently exists and insert the currYear only once the value in
      // the selectionsSorted array is greater than currYear, since we already know that currYear is not the 
      // lowest value. Break out of our loop when this happens.
      for (j = 0; j < selectionsSorted.length; j++) {
        if (currYear < selectionsSorted[j]) {
          selectionsSorted.splice(j, 0, currYear);
          break;
        }
      }
    }
  }
  // If this is the first iteration of the loop, set our comparators and add the first value to the sorted array.
  else {
    selectionsSorted.push(currYear);
    lowest = currYear;
    highest = currYear;
  }
}


array method sort


// Sort the array of random selections in order to list them chronologically on the page. Return the sorted array.
function sortSelectionsArray(selections, entriesNum, selectionsSorted = [], lowest = 0, highest = 0) {
  // Loop through the unsorted selections array.
  for (let i = 0; i < entriesNum; i++) {
    const currYear = selections[i].year; // Set currYear to the currently selected year. 
    // If this is not the first iteration of the loop, do our comparisons.
    if (selectionsSorted.length !== 0) {
      // If currYear is before the earliest year we've seen so far, add it 
      // to the front of the array and set our lowest comparator to currYear.
      if (currYear < lowest) {
        selectionsSorted.unshift(selections[i]); // Add the object that corresponds to currYear to the front of the sorted array.
        lowest = currYear; // Set our lowest year comparator to currYear.
      }
      // If currYear is after the latest year we've seen so fasr, add it
      // to the end of the array and set our highest comparator to currYear
      else if (currYear > highest) {
        selectionsSorted.push(selections[i]); // Add the object that corresponds to currYear to the back of the sorted array.
        highest = currYear; // Set our highest year comparator to currYear.
      }
      // If currYear is neither lowest nor highest, insert the corresponding object into the selectionsSorted array at the correct location.
      else {
        // Loop through the sorted array as it currently exists and insert the object that corresponds to currYear only 
        // once the value in the selectionsSorted array is greater than currYear. Break out of our loop when this happens.
        console.log(selections[i]);
        for (j = 0; j < selectionsSorted.length; j++) {
          if (currYear < selectionsSorted[j]) {
            selectionsSorted.splice(j, 0, selections[i]);
            break;
          }
        }
      }
    }
    // If this is the first iteration of the loop, set our comparators and add the corresponging object to the sorted array.
    else {
      selectionsSorted.push(selections[i]);
      lowest = currYear;
      highest = currYear;
    }
  }
  // Return our sorted array of objects.
  return selectionsSorted;
}