#### **App Title:** *today is...*

#### **App Description:** *This is going to be a single page web-app that aggregates data about the current day and presents it neatly in one place using a Pinterest-esque CSS style that will employ grids.*

#### **API's Used:** *Wikipedia, New York Times, YouTube, NASA*

#### **API Snippet:**

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
    "text": "A gas leak underneath the Pemex Executive Tower in Mexico City caused an explosion that killed at least 37 people and injured another 121."
  }
]
```
#### **Wireframes:** *Below is a rough sketch of the proposed layout.*
![alt text](https://raw.githubusercontent.com/joeyvalley/today-is/main/assets/wireframe.jpg)

#### **MVP:** *At the bare minimum, I would like to have all of my API calls that return text-based content to be working and creating a responsive design, where the text from the resulting API calls resulting in different-sized HTML elements depending on the day. This will mean successfully integrating the Wikipedia API and New York Times API.*

#### **Post-MVP:** *Allow for the user to select the date that is displayed. I plan to integrate other API's that will provide image and video content, i.e. the YouTube API and the NASA API. Beyond that, I would like to continue to integrate new API's into the page and over time create an app with dozens of API's returning all kinds of data that can be perused by the user.*

#### **Goals:**
#### Tuesday: *Today I would like to have my project approved so I can begin working on the coding. Once approved I will start writing my javascript to make the API calls so I can begin planning out how I am going to work with the data structures they return*
#### Wednesday: *Once I've successfully figured out how to integrate the Wikipedia API, I want to begin to start working on the CSS. Since I am planning on using the Wikipedia API to populate several different divs on the page, I'll need to tackle the CSS early on in order to continue adding the content from other API's.*
#### Thursday: *Continue working on the CSS and overall design of the page. Begin integrating my Javascript into the HTML with event listener's so I can see how content is dynamically added to the page.*
#### Friday: *Debugging issues and integrating additional API's.*
#### Saturday - Sunday: *Continue debugging and dialing in the styles. Adding the functionality that would allow for the user to select different dates to be displayed.*

#### **Priorities:** *I think the Javascript and the CSS are going to take the longest. The design itself is very straightforward and I don't think will change much over the course of development.*
![alt-text](https://github.com/joeyvalley/today-is/blob/main/assets/PRIORITIES.jpg?raw=true)


#### **Timeframes:**
#### Tuesday: *3PM - 5PM*
#### Wednesday: *12PM - 5PM*
#### Thursday: *9AM - 5PM*
#### Friday: *9AM - 5PM*
#### Saturday - Sunday: *As needed (TBD)*


