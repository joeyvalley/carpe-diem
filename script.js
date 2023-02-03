
// Declare our global variables.
const today = new Date();
const day = String(today.getDate());
const month = String(today.getMonth() + 1).padStart(2, '0');
const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthStr = monthArr[month - 1];
const year = today.getFullYear();
const wikiAllURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;
const wikiFeaturedURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${String(today.getDate()).padStart(2, '0')}`;
const entriesNum = 5;


// Call the functions to set up the page.
setUpNavBar(); // Gets and sets the content for the navigation bar.
addHeaderEventListeners();
wikiAllFetch(wikiAllURL); // Gets and sets the content for selected articles, births, deaths, and holidays.
wikiFeaturedFetch(wikiFeaturedURL); // Gets and sets the content for today's featured article.
nyTimesFetch();

function setUpNavBar() {
  // Set the date at left.
  const todaySpan = document.getElementById("today");
  todaySpan.innerHTML = `${month}/${String(today.getDate()).padStart(2, '0')}/${year} &#127757;`;
  // Start the clock.
  startTime();
  // Get IP address and location.
  getIP();
  // Set up the first grid-box
  const p = document.getElementById("holidays-p");
  p.innerHTML = `<span class="date">Today is ${monthStr} ${day}, ${year}.</span> &#128197;`;
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
    getHistory(selected);
    getHolidays(holidays);
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
    console.log("Wikipedia is taking too long.")
  }
}

async function nyTimesFetch(articlesArr = [], sections = ['us', 'world', 'business', 'opinion', 'crosswords']) {
  const URL = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=DmexZKsgYhcssqlm8cy4sd1tMa7D6Uri";

  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    const articles = jsonObject.results;
    articlesArr = sections.map(s => articles.find(a => a.section === s));
    setNewsArticles(articlesArr.sort((a, b) => a.section.localeCompare(b.section)));
  }
  catch (error) {
    console.log(error);
  }
}

function setNewsArticles(articles) {
  const container = document.getElementById("news");
  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "news-content";
  articles.forEach(article => {
    const p = document.createElement("p");
    p.innerHTML = `<span class="date">${article.title}</span><br/>${article.abstract}`;
    content.append(p);
  });
  const footer = document.createElement("p");
  footer.classList.add("bottom");
  footer.innerHTML = "&#128169; ᴀʟʟ ᴛʜᴇ ᴍᴜᴄᴋ ᴛʜᴀᴛs ꜰɪᴛ ᴛᴏ ʀᴀᴋᴇ &#128169;";
  content.append(footer);

  container.append(content);
}

function addHeaderEventListeners() {
  const headers = Array.from(document.querySelectorAll(".header"));
  for (const header of headers) {
    header.addEventListener('click', (event) => {
      const selected = document.getElementById(`${event.target.id.split("-")[0] + "-content"}`);
      selected.classList.toggle("show");
    });
    // header.addEventListener('mouseover', () => {
    // })
  }
}

function getHistory(selected, selections = []) {
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
  setHistory(selections);
}

function setHistory(selections) {
  const container = document.getElementById("history");

  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "history-content";

  for (const selection of selections) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date">${monthArr[month - 1]} ${day}, ${selection.year}:</span> ${selection.description}`;
    content.append(p);
  }
  const footer = document.createElement("p");
  footer.innerHTML = `<p class="bottom">&#128220; ʟᴇꜱᴛ ᴡᴇ ꜰᴏʀɢᴇᴛ &#128220;</p>`;
  content.append(footer);

  container.append(content);
}

function getHolidays(holidays) {
  const holiday = holidays[0].text;
  const description = holidays[0].pages[0].extract;
  const daySuffix = suffix();

  const container = document.getElementById("today-info");
  const p = document.createElement("p")
  p.innerHTML = `It is the <span class="date">${daySuffix}</span> of the year.<br /><br />It's <span class="date">${holiday}</span>. ${description}`;
  container.append(p);
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

  const container = document.getElementById("birthdays");

  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "birthdays-content";

  for (const newborn of theLiving) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date"><a href="${newborn.link}" target="_blank">${newborn.name}</a></span>, ${monthArr[month - 1]} ${String(today.getDate())}, ${newborn.year} <br />${newborn.description}`;
    content.append(p);
  }
  const footer = document.createElement("p");
  footer.innerHTML = `<p class="bottom">&#127874; ʜᴀᴘᴘʏ ʙɪʀᴛʜᴅᴀʏ &#127874;</p>`;
  content.append(footer);

  container.append(content);
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

  const container = document.getElementById("deathdays");

  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "deathdays-content";

  for (const theDeceased of theDead) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date"><a href="${theDeceased.link}" target="_blank">${theDeceased.name}</a>, ${monthArr[month - 1]} ${String(today.getDate())}, ${theDeceased.year}</span><br />${theDeceased.description} `;
    content.append(p);
  }
  const footer = document.createElement("p");
  footer.innerHTML = `<p class="bottom">&#129702; ʀᴇꜱᴛ ɪɴ ᴘᴇᴀᴄᴇ &#129702;</p>`;
  content.append(footer);

  container.append(content);
}

// Set featured article to the DOM.
function setFeaturedArticle(article) {

  const title = article.normalizedtitle;
  const description = article.extract;
  const link = article.content_urls.desktop.page;

  const container = document.getElementById("featured");
  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "featured-content";

  const p = document.createElement("p");
  p.innerHTML = `<span class="date"><a href="${link}" target="_blank">${title}</a></span><br />${description}`;
  content.append(p);
  container.append(content);
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

// Copy and paste clock code from W3Schools : )
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let AMPM = "AM";
  if (h > 12) { h = h - 12; AMPM = "PM"; }
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time").innerHTML = "&#128368;    " + h + ":" + m + ":" + s + " " + AMPM;
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
    // console.log(jsonObject);
    const city = jsonObject.city;
    const state = jsonObject.region_iso_code;
    const zipCode = jsonObject.postal_code;
    const country = jsonObject.country_code;
    // const flagEmoji = jsonObject.flag.emoji;
    setLocation(city, state, zipCode, country);
    initMap(jsonObject.latitude, jsonObject.longitude);
  } catch (error) {
    console.log(error);
  }
}

// Set users physical location in the navigation bar.
function setLocation(city, state, zipCode, country) {
  const location = document.getElementById("location");
  location.innerText = `${city}, ${state} ${country}`;
}

// Setup the map with the users location as the center.
function initMap(lat, lang) {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: lat, lng: lang },
    zoom: 17,
    zoomControl: true,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  });
  // map.setTilt(45);
}

// Copied from Stack Overflow, adds the correct suffix to our date.
function suffix() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const i = Math.floor(diff / oneDay);
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}


