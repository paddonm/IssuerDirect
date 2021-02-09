// Begin OnSchedJs Logic
var onsched = OnSched(window.clientId, 'sbox');

/// Get instance of elements to use for creating elements
var elements = onsched.elements();

// AppointmentsElement
const mountAppointments = (mountComponent, options, params, meetingHistory) => {
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
      setLoading(true);
      if (!document.querySelectorAll('#dashboard').length) {
        new Promise((resolve) => {
          const element = createDiv('dashboard', `<div id="dashboard"></div>`);
          elAppDiv.appendChild(element);
          resolve(elAppDiv.appendChild(element));
        }).then(() => {
          setLoading(false);
          updateNavItem(navItems[0]);
          mountHeader();
          if (meetingHistory) {
            updateMeetings(e.detail).then(() => {
              mountComponent();
            })
          }
          else {
            updateAppointments(e.detail).then(() => {
              mountComponent();
            })
          }
        });
      }
      else {
        if (meetingHistory) {
          updateMeetings(e.detail).then(() => {
            setLoading(false);
            mountComponent();
          })
        }
        else {
          updateAppointments(e.detail).then(() => {
            setLoading(false);
            mountComponent();
          })
        }
      }
    });
    
    appointments.mount('appointments');
  })
}

// CustomersElement
const mountCustomers = (mountComponent, options = {}, params = {}) => {
  setLoading(true);
  checkElements('#customer').then(resp => {
    const elCustomer = resp[0];
    
    var customerOptions = {};
    if (options)
      customerOptions = options;
    
    var customerParams = {};
    
    if (params)
      customerParams = params;
    
    var customer = elements.create("customer", customerParams, customerOptions);
    
    elCustomer.addEventListener("getCustomers", function (e) {
      setLoading(false);
        updateCustomers(e.detail).then(() => mountComponent());
    });
    customer.mount('customer');
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
          appState.locationId = e.detail.id;
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