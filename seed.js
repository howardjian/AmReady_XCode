module.exports = JSON.stringify({
   name: 'Candice',
   alarms: [
      {
         timerId: null,
         alarmName: 'Class',
         isRecurring: 1,
         daysOfWeek: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
         route: {
            start_lat: 37.78825,
            start_long: -122.4324,
            end_lat: 37.78825 ,
            end_long: -122.4324,
            modeOfTransport: 'Train',
            preferredRoute: '423dsfr3r32sf',
            address: {
              start: '',
              end: ''
            },
            routeSelected: false,
            routeIndex: null,
            duration: 50
         },
         prepTime: 10,
         arrivalTime: 'Thu Jun 29 2017 17:00:00 GMT-0400 (EDT)',
         contacts: [
            {
               user: 56,
               type: 'email'
            }
         ]
      },
      {
         timerId: 1,
         alarmName: 'Gym',
         isRecurring: 1,
         daysOfWeek: ['Mon', 'Tues', 'Thurs', 'Fri'],
         route: {
            start_lat: 37.78825,
            start_long: -122.4324,
            end_lat: 37.78825 ,
            end_long: -122.4324,
            modeOfTransport: 'Train',
            preferredRoute: '423dsfr3r32sf',
            address: {
              start: '5 Hanover Square',
              end: '95 Wall Street'
            },
            routeSelected: false,
            routeIndex: null,
            duration: 34
         },
         prepTime: 10,
         arrivalTime: 'Thu Jun 29 2017 17:00:00 GMT-0400 (EDT)',
         contacts: [
            {
               user: 56,
               type: 'email'
            }
         ]
      },
      {
         timerId: null,
         alarmName: 'Demo-Day',
         isRecurring: 1,
         daysOfWeek: ['Thurs'],
         route: {
            start_lat: 37.78825,
            start_long: -122.4324,
            end_lat: 37.78825 ,
            end_long: -122.4324,
            modeOfTransport: 'Train',
            preferredRoute: '423dsfr3r32sf',
            address: {
              start: '',
              end: ''
            },
            routeSelected: false,
            routeIndex: null,
            duration: 10
         },
         prepTime: 10,
         arrivalTime: 'Thu Jun 29 2017 17:00:00 GMT-0400 (EDT)',
         contacts: [
            {
               user: 56,
               type: 'email'
            }
         ]
      }
   ],
   locations: [
      {
         address: '5 Hanover Square',
         type: 'work'
      },
      {
         address: '95 Wall Street',
         type: 'home'
      }
   ]
});
