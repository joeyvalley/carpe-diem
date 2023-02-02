
// Declare our global variables.
const today = new Date();
const day = String(today.getDate());
const month = String(today.getMonth() + 1).padStart(2, '0');
const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const year = today.getFullYear();
const wikiAllURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;
const wikiFeaturedURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${String(today.getDate()).padStart(2, '0')}`;
const entriesNum = 10;

// Call the functions to set up the page.
setUpNavBar(day, month, monthArr, year); // Gets and sets the content for the navigation bar.
wikiAllFetch(wikiAllURL); // Gets and sets the content for selected articles, births, deaths, and holidays.
wikiFeaturedFetch(wikiFeaturedURL); // Gets and sets the content for today's featured article.

function setUpNavBar(day, month, monthArr, year) {
  // Set the date at left.
  const nav = document.querySelector("nav");
  const todayIs = document.getElementById("today");
  todayIs.innerText = `${monthArr[month - 1]} ${day}, ${year}`;
  // Start the clock.
  startTime();
  // Get IP address and location.
  getIP();
}

// Async function that gets and sets our data from the daily Wikipedia landing page.
async function wikiAllFetch(URL) {
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    // Store the API responses as arrays in their individual categories.
    const births = jsonObject.births;
    const deaths = jsonObject.deaths;
    const events = jsonObject.events;
    const holidays = jsonObject.holidays;
    const selected = jsonObject.selected;
    getBirths(births);
    getDeaths(deaths);
    getSelected(selected, entriesNum);
  } catch (error) {
    console.log(error);
  }
}

// Async function that gets and sets our date from Wikipedia's featured article of the day.
async function wikiFeaturedFetch(URL) {
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    // Number of entries we want per content block.
    const entriesNum = 5;
    // Store the API responses as arrays in their individual categories.
    const featuredArticle = jsonObject.tfa;
    const mostRead = jsonObject.mostread;
    setFeaturedArticle(featuredArticle);
  } catch (error) {
    console.log(error);
  }
}

// Select random entries from the "selection" array returned by our API call.
function getSelected(selected, entriesNum, selections = []) {
  // Generate random numbers to use as indexes to pull from the "selection" array.
  const randEntries = randomSelection(selected.length, entriesNum);
  // Loop through our random array and pull out the entry at the random index.
  while (randEntries.length > 0) {
    let currSelection = selected[randEntries.pop()];
    selections.push({ year: currSelection.year, description: currSelection.text });
  }
  // Sort the array by year in order to display the information chronologically.
  selections.sort((a, b) => a.year - b.year);

  // Add the sorted data to the DOM.
  setSelected(selections);
}

// Add our selections to the DOM.
function setSelected(selections) {
  const containerDiv = document.getElementById("grid-right");
  const addDiv = document.createElement("div");
  addDiv.innerHTML = `<p class="date">History  &#128197;</p>`;
  addDiv.classList.add("grid-box");
  for (const selection of selections) {
    let addP = document.createElement("p");
    addP.innerHTML = `<span class="date">${monthArr[month - 1]} ${day}, ${selection.year}:</span> ${selection.description}`;
    addDiv.append(addP);
  }
  containerDiv.append(addDiv);
}

function getBirths(births, theLiving = []) {
  const randEntries = randomSelection(births.length, entriesNum);
  for (let i = 0; i < entriesNum; i++) {
    let birth = births[randEntries[i]]
    theLiving.push({ name: birth.pages[0].normalizedtitle, year: birth.year, link: birth.pages[0].content_urls.desktop.page, description: birth.pages[0].extract, });
  }
  theLiving.sort((a, b) => a.year - b.year);
  setBirths(theLiving.reverse());
}

function setBirths(theLiving) {
  const containerDiv = document.getElementById("grid-left");
  const addDiv = document.createElement("div");
  addDiv.innerHTML = `<p class="date">Birthdays &#128118;</p>`;
  addDiv.classList.add("grid-box");
  for (const newborn of theLiving) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date"><a href="${newborn.link}" target="_blank">${newborn.name}</a></span>, ${month}/${String(today.getDate()).padStart(2, '0')}/${newborn.year}<br />${newborn.description}`;
    addDiv.append(p);
  }
  containerDiv.append(addDiv);
}

function getDeaths(deaths, theDead = []) {
  const randEntries = randomSelection(deaths.length, entriesNum);
  for (let i = 0; i < entriesNum; i++) {
    let death = deaths[randEntries[i]]
    theDead.push({ name: death.pages[0].normalizedtitle, year: death.year, link: death.pages[0].content_urls.desktop.page, description: death.pages[0].extract, });
  }
  theDead.sort((a, b) => a.year - b.year);
  setDeaths(theDead.reverse());
}

function setDeaths(theDead) {
  const containerDiv = document.getElementById("grid-center");
  const addDiv = document.createElement("div");
  addDiv.innerHTML = `<p class="date">Deathdays &#128128;</p>`;
  addDiv.classList.add("grid-box");
  for (const theDeceased of theDead) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date"><a href="${theDeceased.link}" target="_blank">${theDeceased.name}</a></span>, ${month}/${String(today.getDate()).padStart(2, '0')}/${theDeceased.year}<br />${theDeceased.description}`;
    addDiv.append(p);
  }
  containerDiv.append(addDiv);
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

// Add featured article to the DOM.
function setFeaturedArticle(article) {
  const title = article.normalizedtitle;
  const description = article.extract;
  const link = article.content_urls.desktop.page;

  const gridBox = document.createElement("div");
  gridBox.classList.add("grid-box");
  gridBox.id = article.normalizedtitle;
  gridBox.innerHTML = "<p>Featured Article</p>";

  const p = document.createElement("p");
  p.innerHTML = `<p><span class="date">${title}</span><br />${description}<br /><a href="${link}" target="_blank">More info</a></p>`;
  gridBox.append(p);

  const gridRight = document.getElementById("grid-right");
  gridRight.append(gridBox);
}

// Clear out the extra space at the bottom of each column once all the stuff has been added.
function clearLastBox() {
  const leftCol = document.getElementById("grid-left");
  const centerCol = document.getElementById("grid-center");
  const rightCol = document.getElementById("grid-right");

  const dummyDiv = document.createElement("div");
  dummyDiv.classList.add("grid-box");
  dummyDiv.classList.add("hided");

  leftCol.append(dummyDiv);
  centerCol.append(dummyDiv);
  rightCol.append(dummyDiv);
}

// Copy and paste clock code from W3Schools : )
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time").innerText = h + ":" + m + ":" + s;
  setTimeout(startTime, 1000);
}

// Update the clock every second.
function checkTime(i) {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

// Get users IP address and pass it to a different API to get their physical location.
async function getIP() {
  const URL = "https://api.ipify.org/?format=json";
  const URL2 = "https://ipgeolocation.abstractapi.com/v1/?api_key=9e5e1f56b5414aee82336cd8ac36ff92&ip_address="
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    getLocation(URL2 + jsonObject.ip);
  } catch (error) {
    console.log(error);
  }
}

// Get users physical location.
async function getLocation(URL) {
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    const city = jsonObject.city;
    const state = jsonObject.region_iso_code;
    const zipCode = jsonObject.postal_code;
    const country = jsonObject.country_code;
    //const flagEmoji = jsonObject.flag.emoji;
    setLocation(city, state, zipCode, country);
    getMap(jsonObject.latitude, jsonObject.longitude);
  } catch (error) {
    console.log(error);
  }
}

// Set users physical location in the navigation bar.
function setLocation(city, state, zipCode, country, flagEmoji) {
  const location = document.getElementById("location");
  location.innerText = `${city}, ${state} ${zipCode}`;
}

// Try to use GoogleMaps API to get a map?
function getMap(lat, long) {
  // console.log(lat, long);
}