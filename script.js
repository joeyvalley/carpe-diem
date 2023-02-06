
// Declare our global variables.
const today = new Date();
const day = String(today.getDate());
const month = String(today.getMonth() + 1).padStart(2, '0');
const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthStr = monthArr[month - 1];
const year = today.getFullYear();
const wikiAllURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day.padStart(2, '0')}`;
const wikiFeaturedURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${String(today.getDate()).padStart(2, '0')}`;
const entriesNum = 5;

// console.log(wikiAllURL);

// Call the functions to set up the page.
setUpNavBar(); // Gets and sets the content for the navigation bar.
addHeaderEventListeners();
wikiAllFetch(wikiAllURL); // Gets and sets the content for selected articles, births, deaths, and holidays.
wikiFeaturedFetch(wikiFeaturedURL); // Gets and sets the content for today's featured article.
nyTimesFetch();
getHoroscope();
youtubeFetch();

// Sets up the nav bar.
function setUpNavBar() {
  // Set the date at left.
  const selectBar = document.getElementById("today");

  // Set the select bar with previous 30 days dates.
  let dayCounter = today.getDate();
  let flag = false;
  for (let i = 0; i <= 30; i++) {
    if (dayCounter === today.getDate()) {
      const option = document.createElement("option");
      option.value = `${month}/${day}/${year}`;
      option.innerText = `${monthStr} ${day}, ${year}`;
      selectBar.append(option);
    }
    else if (dayCounter === 0 && monthStr === "March") {
      dayCounter = 28;
      const option = document.createElement("option");
      option.value = `${today.getMonth()}/${dayCounter}/${year}`;
      option.innerText = `${monthArr[today.getMonth() - 1]} ${dayCounter}, ${year}`;
      selectBar.append(option);
      flag = true;

    }
    else if (dayCounter === 0 && (monthStr === "October" || monthStr === "May" || monthStr === "July" || monthStr === "December")) {
      dayCounter = 30;
      const option = document.createElement("option");
      option.value = `${today.getMonth()}/${dayCounter}/${year}`;
      option.innerText = `${monthArr[today.getMonth() - 1]} ${dayCounter}, ${year}`;
      selectBar.append(option);
      flag = true;
    }
    else if (dayCounter === 0 && monthStr === "January") {
      dayCounter = 31;
      const option = document.createElement("option");
      option.value = `${today.getMonth()}/${dayCounter}/${year}`;
      option.innerText = `${monthArr[today.getMonth() - 1]} ${dayCounter}, ${year - 1}`;
      selectBar.append(option);
      flag = true;

    }
    else if (dayCounter === 0) {
      dayCounter = 31;
      // console.log(dayCounter);
      const option = document.createElement("option");
      option.value = `${today.getMonth()}/${dayCounter}/${year}`;
      option.innerText = `${monthArr[today.getMonth() - 1]} ${dayCounter}, ${year}`;
      selectBar.append(option);
      flag = true;
    }
    else if (flag === true) {
      const option = document.createElement("option");
      option.value = `${today.getMonth()}/${dayCounter}/${year}`;
      option.innerText = `${monthArr[today.getMonth() - 1]} ${dayCounter}, ${year}`;
      selectBar.append(option);
    }
    else {
      const option = document.createElement("option");
      option.value = `${month}/${day}/${year}`;
      option.innerText = `${monthStr} ${dayCounter}, ${year}`;
      selectBar.append(option);
    }
    dayCounter--;
  }

  // Add event listener to select bar to clear out HTML and re-populate with results of new API call.
  // selectBar.addEventListener('change', (e) => {
  //   try {
  //     console.log(e.target.value);
  //     document.getElementById("news").remove();
  //     const newMonth = e.target.value.split("/")[0].padStart(2, '0');
  //     const newDay = e.target.value.split("/")[1].padStart(2, '0');
  //     const newYear = e.target.value.split("/")[2];
  //     const newWikiSearch1 = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${newMonth}/${newDay}`;
  //     const newWikiSearch2 = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${newYear}/${newMonth}/${newDay}`;
  //     console.log(newWikiSearch1);
  //     console.log(newWikiSearch2);
  //     // console.log(newMonth, newDay, newYear);
  //     const contentBoxes = Array.from(document.querySelectorAll(".grid-box"));
  //     for (box in contentBoxes) {
  //       let contentBox = contentBoxes[box].querySelector(".content");
  //       if (contentBox === null) {
  //         console.log("haha");
  //       }
  //       else {
  //         contentBox.innerHTML = "";
  //       }
  //     }
  //     wikiAllFetch(newWikiSearch1);
  //     wikiFeaturedFetch(newWikiSearch2);
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // })
  // Start the clock.
  startTime();
  // Get IP address and location.
  getIP();
  // Set up the first grid-box
  const p = document.getElementById("holidays-p");
  p.innerHTML = `<span class="date">Today is ${monthStr} ${day}, ${year}.</span> &#128197;`;
  // addFooter();

}

// Async function that gets and sets our data from the daily Wikipedia landing page.
async function wikiAllFetch(URL) {
  console.log(URL);
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    console.log(jsonObject);
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
  // console.log(URL);
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
    // console.log(article);
    const p = document.createElement("p");
    let section = article.section;
    switch (section) {
      case "business":
        section = section[0].toUpperCase() + section.substring(1);
        break;
      case "us":
        section = "US News"
        break;
      case "crosswords":
        section = "Games";
        break;
      case "opinion":
        section = "Opinion"
        break;
      default:
        section = section[0].toUpperCase() + section.substring(1) + " News";
    }
    p.innerHTML = `<span class="date"><a href="${article.url}" target="_blank">${section}</a></span><br/>${article.abstract}`;
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
  const randEntries = randomSelection(selected.length, 5);
  // Loop through our random array and pull out the entry at the random index.
  while (randEntries.length > 0) {
    let currSelection = selected[randEntries.pop()];
    // console.log(currSelection);
    selections.push({ year: currSelection.year, description: currSelection.text });
  }
  // Sort the array by year in order to display the information chronologically.
  selections.sort((a, b) => a.year - b.year);
  // Add the sorted data to the DOM.
  setHistory(selections.reverse());
}

function setHistory(selections) {
  const container = document.getElementById("history");

  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "history-content";

  for (const selection of selections) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date">${monthStr} ${day}, ${selection.year}:</span> ${selection.description}`;
    content.append(p);
  }
  const footer = document.createElement("p");
  footer.innerHTML = `<p class="bottom">&#128220; ʟᴇꜱᴛ ᴡᴇ ꜰᴏʀɢᴇᴛ &#128220;</p>`;
  content.append(footer);

  container.append(content);
}

function getHolidays(holidays) {
  const randHoliday = Math.floor(Math.random() * holidays.length);
  // console.log(holidays[randHoliday]);
  const holiday = holidays[randHoliday].text;
  const description = holidays[randHoliday].pages[0].extract;
  const link = holidays[randHoliday].pages[0].content_urls.desktop.page;
  const daySuffix = suffix();

  const container = document.getElementById("today-info");
  const p = document.createElement("p")
  p.innerHTML = `It is the <span class="date">${daySuffix}</span> of the year.<br /><br />It's <span class="date"><a href="${link}" target="_blank">${holiday}</a></span>. ${description}`;
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
    p.innerHTML = `<span class="date"><a href="${newborn.link}" target="_blank">${newborn.name}</a>, ${monthStr} ${String(today.getDate())}, ${newborn.year}</span><br />${newborn.description}`;
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
    p.innerHTML = `<span class="date"><a href="${theDeceased.link}" target="_blank">${theDeceased.name}</a>, ${monthStr} ${String(today.getDate())}, ${theDeceased.year}</span><br />${theDeceased.description} `;
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

  const footer = document.createElement("p");
  footer.classList.add("bottom");
  footer.innerHTML = "&#128563; ʜᴏʟʏ ꜱʜɪᴛ ᴛʜᴀᴛ'ꜱ ᴀᴍᴀᴢɪɴɢ &#128563;";
  content.append(footer);

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
    // console.log(jsonObject); const city = jsonObject.city;
    const state = jsonObject.region_iso_code;
    const zipCode = jsonObject.postal_code;
    const country = jsonObject.country_code;
    // setLocation(city, state, zipCode, country);
    initMap(jsonObject.latitude, jsonObject.longitude);
  } catch (error) {
    // If the Location API shits out, just plug in the center of the universe.
    console.log(error);
    initMap(40.712776, -74.005974);
  }
}

// Set users physical location in the navigation bar.
function setLocation(city, state, zipCode, country) {
  const location = document.getElementById("location");
  location.innerText = `${city}, ${state} ${country}`;
}

// Setup the map with the users location as the center.
function initMap(lat, lang) {
  // console.log(lat, lang);
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: lat, lng: lang },
    zoom: 14,
    zoomControl: true,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  });
  // document.getElementById("map").id = "peepee";
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

// Get horoscopes from RapidAPI
async function getHoroscope(horoscopes = []) {
  const signs = [
    { sign: "aries", symbol: "&#9800;" },
    { sign: "taurus", symbol: "&#9801;" },
    { sign: "gemini", symbol: "&#9802;" },
    { sign: "cancer", symbol: "&#9803;" },
    { sign: "leo", symbol: "&#9804;" },
    { sign: "virgo", symbol: "&#9805;" },
    { sign: "libra", symbol: "&#9806;" },
    { sign: "scorpio", symbol: "&#9807;" },
    { sign: "sagittarius", symbol: "&#9808;" },
    { sign: "capricorn", symbol: "&#9809;" },
    { sign: "aquarius", symbol: "&#9810;" },
    { sign: "pisces", symbol: "&#9811;" }
  ];
  try {
    for (let i = 0; i < signs.length; i++) {
      const options = { method: 'POST', headers: { 'X-RapidAPI-Key': 'caed20f691msh9abdd5eb98e3543p1ed232jsn8a4c5b3b5f0b', 'X-RapidAPI-Host': 'sameer-kumar-aztro-v1.p.rapidapi.com' } };
      const res = await fetch(`https://sameer-kumar-aztro-v1.p.rapidapi.com/?sign=${signs[i].sign}&day=today`, options);
      let sign = signs[i].sign;
      let symbol = signs[i].symbol;
      sign = sign[0].toUpperCase() + sign.substring(1);
      const horoscope = await res.json();
      const mood = horoscope.mood;
      const luckyNo = horoscope.lucky_number;
      const description = horoscope.description;
      horoscopes.push({ sign: sign, symbol: symbol, mood: mood, luckyNo: luckyNo, description: description });
    }
    setHoroscope(horoscopes);
  }
  catch (error) {
    console.log(error);
  }

  // setHoroscope(jsonResponse, sign);
}


// Add horoscopes to DOM
function setHoroscope(horoscopes) {
  const container = document.getElementById("horoscope");
  const content = document.createElement("div");
  content.classList.add("content");
  content.id = "horoscope-content";
  for (const horoscope of horoscopes) {
    let p = document.createElement("p");
    p.innerHTML = `<span class="date">${horoscope.symbol} ${horoscope.sign}</span><br />${horoscope.description}<br /><span class="date">Lucky Number:</span> ${horoscope.luckyNo}`;
    content.append(p);
  }
  const footer = document.createElement("p");
  footer.innerHTML = `<p class="bottom">&#127756; ɪᴛ'ꜱ ᴡʀɪᴛᴛᴇɴ ɪɴ ᴛʜᴇ ꜱᴛᴀʀꜱ &#127756;</p>`;
  content.append(footer);

  container.append(content);
}

async function youtubeFetch() {
  const URL = "https://youtube.googleapis.com/youtube/v3/search?q=daily%20horoscope&channelId=UCB1qdEA63QN-eptTZLV8xxA&maxResults=1&order=date&key=AIzaSyDKJnzUeLMF750WbkItYzJRds5FSIxbOgM";

  try {
    const res = await fetch(URL);
    const jsonResponse = await res.json();
    const videoId = jsonResponse.items[0].id.videoId;

    const container = document.getElementById("youtube");
    const width = (container.offsetWidth) - 20;
    const height = Math.floor(width / 1.77777777777778);
    // console.log(width, height);
    const content = document.createElement("div");
    const embed = `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" title="Today's Horoscopes" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`;

    content.classList.add("youtube-vid");
    content.id = "youtube-vid";
    content.innerHTML = embed;
    container.append(content);
  }
  catch (error) {
    console.log(error);
  }
}

// function addFooter() {
//   const footer = document.createElement("p");
//   footer.classList.add("bottom")
//   footer.innerHTML = "&#127748; ᴄᴀʀᴘᴇ ᴅɪᴇᴍ &#127748;"
//   const container = document.getElementById("today-info");
//   container.append(footer);
// }

