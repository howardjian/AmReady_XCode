# AM Ready

[Candice Bousquet](https://github.com/CandiceBousquet/) | [Grant Herman](https://github.com/grantlouisherman) | [Howard Jian](https://github.com/howardjian/) | [Shon Elias](https://github.com/Shon-Elias)

AM Ready is a commute-sensitive, smart alarm app for iOS devices that adjusts your alarm clock base on your preferred public transit route.

The tech stack for our application consists of AsyncStorage for storing alarms on the user's local device, React-Redux for state management, React Native and React Navigation for our front-end as well as various third party APIs such as Google Maps Directions and Google Autocomplete.

Our decision to use AsyncStorage to store alarms instead of other external databases made the most sense as we wanted to keep the data local to the user's device.

We chose React-Redux to more easily manage the different global and local states of the alarm application including: alarms, direction/autocomplete fetches, notifications, sounds, background timers, and user-inputted information.

Using React Native allowed us to build our alarm as a mobile application in JavaScript. Although it is still very young (we are currently using version 0.45 and the latest release as of this README is .46) and there were many challenges along the way, we found it very rewarding to be able to tackle the many hurdles in working with an early-stage library.

Our application works by having the user input the required fields of the alarm (name, prep time, etc.):

  - Upon entering into the address field, we make 3 fetch requests to Google Autocomplete to check whether the user input is a region, establishment or an address and from the returned lists, we output the autocomplete list.
  - Once the Start and End locations are filled out and the user hits 'get directions', we send a fetch requests to Google Directions API and unravel the nested JSON response to get all of the information, including possible routes, route hashes (which we decode using the utility function), duration, etc.
  - We re-center the map between the start and end point
  - We output the list of possible public transit routes as a list
  - Upon selecting a route, we draw the coordinates from the decoded route hash and connect them via polylines (line segments)

When the user hits save alarm, we trigger a background timer:
  - First the background timer will wait until 2 hours before the alarm triggers
  - Then the background timer will fire off a set interval to watch our commute path every 15 minutes and also cancel the initial background timer
    * It will update the alarm time if there has been a change in the commute
  - Once it is within 15 minutes of the actual alarm time, it will fire off a set timeout to cancel the previous interval and fire off the designated alarm time
