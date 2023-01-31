const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const year = today.getFullYear();
const BASE_URL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

wikiFetch(BASE_URL);

async function wikiFetch(URL) {
  try {
    const res = await fetch(URL);
    const jsonObject = await res.json();
    console.log(jsonObject);
  } catch (error) {
    console.log(error);
  }
}

