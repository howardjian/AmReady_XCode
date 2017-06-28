module.exports = JSON.stringify({
   name: 'Candice',
   alarms: [
      {
         alarmName: 'Class',
         isRecurring: 1,
         daysOfWeek: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
         route: {
            start: [25, 26],
            end: [25.4, 26.1],
            modeOfTransport: 'Train',
            preferredRoute: '423dsfr3r32sf'
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
         isRecurring: 0,
         daysOfWeek: ['Sat'],
         route: {
            start: [25, 26],
            end: [26.7, 25.34],
            modeOfTransport: 'Walk',
            preferredRoute: '4bsf78r63rfjk'
         },
         prepTime: 45000,
         arrivalTime: '13:30'
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
