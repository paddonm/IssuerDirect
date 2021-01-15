// Begin OnSchedJs Logic
var onsched = OnSched(window.clientId, 'sbox');

/// Get instance of elements to use for creating elements
var elements = onsched.elements();

// AppointmentsElement
const mountAppointments = (mountComponent, options, params) => {
  var elAppDiv = document.getElementById('app');
  checkElements('#appointments').then(resp => {
    const elAppointments = resp[0];
    const getFromDate = date => moment(date).startOf('month').format('YYYY-MM-DD');
    const getToDate = date => moment(date).endOf('month').format('YYYY-MM-DD');
    
    var appointmentsOptions = {};
    if (options)
      appointmentsOptions = options;
    
    var appointmentsParams = {
      formValues: [
        { paramName: 'startDate', value: getFromDate((appState.date)) },
        { paramName: 'endDate', value: getToDate(moment(appState.date).add(7, 'days')) }
      ]
    };
    
    if (params)
      appointmentsParams = params;
    
    var appointments = elements.create("appointments", appointmentsParams, appointmentsOptions);
    
    elAppointments.addEventListener("getAppointments", function (e) {
      if (!document.querySelectorAll('#calendar').length) {
        new Promise((resolve) => {
          const element = createDiv('calendar', `<div id="calendar"></div>`);
          elAppDiv.appendChild(element);
          resolve(elAppDiv.appendChild(element));
        }).then(() => {
          setLoading(false);
          updateNavItem(navItems[0]);
          mountHeader();
          updateAppointments(e.detail).then(() => {
            mountComponent();
          })
        });
      }
      else {
        updateAppointments(e.detail).then(() => {
          mountComponent();
        })
      }
    });
    
    appointments.mount('appointments');
  })
}

const checkBusinessHours = (locationParams = {}, locationOptions = {}) => {
  businessHoursLoading = true;
  if (!document.querySelectorAll('#location').length) {
    var elLocation = document.createElement('DIV');
    elLocation.id = 'location';
    
    document.getElementById('app').appendChild(elLocation);
  }

  return new Promise(resolve => {
    checkElements('#location').then(resp => {
      var elLocation = resp[0];
      var location = elements.create("location", locationParams, locationOptions);
      if (!Object.keys(appState.businessHours).length) {
        elLocation.addEventListener('getLocation', e => {
          businessHoursLoading = false;
          var businessHours = e.detail.businessHours;
          updateBusinessHours(businessHours)
          
          resolve(businessHours);
        })
        
        location.mount('location');
      }
      else {
        resolve(appState.businessHours);
      }
    })
  })
}