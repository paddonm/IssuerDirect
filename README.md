Issuer Direct Booking Application

Booking application to manage calendar appointments/meetings within the Issuer Direct application.


Structure
- The booking application has been built in vanilla js which is able to be dropped in to any React or Angular application, alternatively can be iFramed in to any website or web application. The network requests are all wrapped in OnSchedJs, a set of wrapped javascript elements which contain all of the calendar applications that will be used. For more information on OnSchedJs please visit our documentation here: https://onsched.readme.io/docs/onschedjs-overview
- The structure of the application is broken into three main components: Contacts, Dashboard, and Meetings. All local state for the application is held in js > appState.js which contains the current date/locationId/etc.
- The routing for the application is done in router.js which will create a new page template using hash routing
- All application and calendar utilities are housed in utils.js, these utilities can be used to clear/create/manage elements within the application

Components
- Contacts: This component contains the logic to mount the Contacts component which displays all of the new contacts, created each time a new customer is booked. Old contacts may also be searched using the Contacts search bar.
- Dashboard: This component contains the calendar application, and analytics widgets which are wrapped in the OnSchedJs elements. The calendar is created using tables by reformatting the response from the Appointments Element (https://onsched.readme.io/docs/consumer-elements#appointment-element) in to table cells which represent each of the appointments throughout a given day/week/month based on the calendar view which is selected.
- Meetings: This component contains the logic to mount the Meetings component which allows for quick management of past and upcomming appointments.

Installation
- Wrapping the vanilla javascript files in AngularJs can be done with an import of the following module: https://www.npmjs.com/package/vanilla-tilt or included within the script tag
- Only 4 HTML tags are required for the application to be wrapped, all remaining logic is contained in the in javascript logic
- Alternatively, if iFrame is preferred for a v1 implementation this can be done by dropping the HTML/CSS/Javascript folders in to a folder to be deployed on your domain and referenced to keep everything out of onsched.com domain
