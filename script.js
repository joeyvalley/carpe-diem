const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const year = today.getFullYear();
const BASE_URL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

wikiFetch(BASE_URL);


// Asynchronous function that gets our data from the Wikipedia API.
async function wikiFetch(URL) {
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    // Number of entries we want per content block.
    const entriesNum = 5;
    // Store the API responses as arrays in their individual categories.
    const births = jsonObject.births;
    const deaths = jsonObject.births;
    const events = jsonObject.events;
    const holidays = jsonObject.holidays;
    const selected = jsonObject.selected;
    getSelected(selected, entriesNum);
  } catch (error) {
    console.log(error);
  }
}

// Select random entries from the "selection" array returned by our API call.
function getSelected(selected, entriesNum, selection = {}, selections = []) {
  // Generate random numbers to use as indexes to pull from the "selection" array.
  const randEntries = randomSelection(selected.length, entriesNum);
  // Loop through our random array and pull out the entry at the random index.
  while (randEntries.length > 0) {
    let currSelection = selected[randEntries.pop()];
    selections.push({ year: currSelection.year, description: currSelection.text });
  }
  // Sort the array by year in order to display the information chronologically.
}

// Create and return an array of random numbers based off the number of entries that were returned. Limit the amount of 
// random numbers by the number of desired entries.
function randomSelection(upperLimit, entriesNum, randArr = []) {
  while (randArr.length < entriesNum) {
    let randNum = Math.floor(Math.random() * upperLimit);
    if (!randArr.includes(randNum)) {
      randArr.push(randNum);
    }
  }
  return (randArr);
}

// Add our selections to the DOM.
function selectionsToDOM(selections) {
  for (const selection of selections) {
    //console.log(selection);
  }
}
