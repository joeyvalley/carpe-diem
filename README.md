#### **App Title:** *today is...*

#### **App Description:** *This is going to be a single page web-app that aggregates data about the current day and presents it neatly in one place.*

#### **API's Used:** *Wikipedia, New York Times, YouTube, NASA*

#### *API Snippet:** 
```javascript
const today = new Date();
const month = today.getMonth() + 1;
const day = today.getDay();
const BASE_URL = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day};
```
#### **API Response:**
```javascript
"onthisday": [
        {
            "text": "A gas leak underneath the Pemex Executive Tower in Mexico City caused an explosion that killed at least 37 people and injured another 121.",


