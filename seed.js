module.exports = JSON.stringify({
   name: 'Candice',
   alarms: [
      {
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
            routeIndex: null
         },
         prepTime: 10000,
         arrivalTime: '9:30',
         contacts: [
            {
               user: 56,
               type: 'email'
            }
         ]
      },
      {
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
              start: '',
              end: ''
            },
            routeSelected: false,
            routeIndex: null
         },
         prepTime: 10000,
         arrivalTime: '9:30',
         contacts: [
            {
               user: 56,
               type: 'email'
            }
         ]
      },
      {
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
            routeIndex: null
         },
         prepTime: 10000,
         arrivalTime: '9:30',
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
