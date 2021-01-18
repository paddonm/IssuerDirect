const meetingsParams = page => ({ 
  limit: '5',
  offset: ((parseInt(page) -1) * 5).toString(),
  formValues: [
    { paramName: 'startDate', value: getStartOfMonth(new Date()) },
    { paramName: 'endDate', value: getEndOfMonth(new Date()) }
  ]
})

const mountMeetingAppointments = () => {
  var elAppDiv = document.getElementById('app');
  clearElement(elAppDiv);
  
  var elAppointments = document.createElement('DIV')  ;
  elAppointments.id = 'appointments';

  elAppDiv.appendChild(elAppointments);
  
  updatePage(1).then(() => {
    updateDate(new Date(moment(new Date())))
    .then(() => {
      mountAppointments(mountMeetings, {}, meetingsParams(1));
    })
  })
}

const mountCreateMeeting = () => {
  mountHeader();
}

const mountDeclineMeeting = () => {
  mountHeader();
}

const mountMeetings = () => {
  var elAppDiv = document.getElementById('app');
  
  updateNavItem(navItems[1]);
  mountHeader();
  
  // Meetings header section
  var elMeetingsWrapper = document.createElement('DIV');
  var elMeetingsDiv;

  if (!Array.prototype.find.call (elAppDiv.childNodes, item => item.id === 'meetings')) {
    var elMeetingsDiv = document.createElement('DIV');
    elMeetingsDiv.id = 'meetings';

    elAppDiv.appendChild(elMeetingsDiv);
  }
  else {
    var elMeetingsDiv = document.getElementById('meetings');
    elMeetingsDiv.id = 'meetings';
  }
  
  var elCreateMeeting = document.createElement('A');
  elCreateMeeting.className = 'create-meeting-button';
  elCreateMeeting.innerHTML = "<i class='fal fa-calendar-alt'></i> Create Meeting"
  elCreateMeeting.onclick = () => {
    createTemplateView('bookmeeting', 'bookmeeting', mountBookingCalendar);
    window.location.assign(location.origin + location.pathname + '#/bookmeeting');
  }
  
  var elStartMeeting = document.createElement('A');
  elStartMeeting.className = 'start-meeting-button';
  elStartMeeting.innerHTML = "<i class='fal fa-phone'></i> Start Meeting"

  var elMeetingsHeader = document.createElement('DIV');
  elMeetingsHeader.className = 'meetings-header';

  elMeetingsHeader.appendChild(elCreateMeeting);
  elMeetingsHeader.appendChild(elStartMeeting);

  // Requests section
  var elRequestsDiv = document.createElement('DIV');
  elRequestsDiv.className = 'meetings-requests';

  var elRequestsTitle = document.createElement('H4');
  elRequestsTitle.innerText = 'Requests';

  var elRequestsList = document.createElement('TABLE');
  elRequestsList.className = 'meetings-requests-list';
  
  var elRequestsListBody = document.createElement('TBODY');

  if (appState.appointments.length) {
    var elRequestsListHeaderRow = document.createElement('TR');
    var requestHeaders = ['Date', 'Requester', 'Company', 'Actions'];

    requestHeaders.map(header => {
      var elRequestsListCol = document.createElement('TH');
      elRequestsListCol.innerText = header;
      
      elRequestsListHeaderRow.appendChild(elRequestsListCol);
    })
  
    elRequestsListBody.appendChild(elRequestsListHeaderRow);
  }
  else {
    elRequestsListBody.innerHTML = '<tr><th class="meetings-requests-no-requests">No upcoming requests</th></tr>';
  }

  appState.appointments.map(appt => {
    var elRequestsListRow = document.createElement('TR');
    
    var elRequestsListCol1 = document.createElement('TD');
    elRequestsListCol1.innerText = appt.date;
    
    var elRequestsListCol2 = document.createElement('TD');
    //elRequestsListCol2.innerHTML = `<img src="${appt.resourceImageUrl}" alt="${appt.name}"/> ${appt.name}`;
    elRequestsListCol2.innerHTML = `<img src="https://onsched.com/assets/img/testimonials/darcie.png" alt="${appt.name}"/> <h5>${appt.name}</h5>`;
    
    var elRequestsListCol3 = document.createElement('TD');
    elRequestsListCol3.innerHTML = appt.customFields.field1.value;
    
    var elRequestsListCol4 = document.createElement('TD');
    
    var createBooking = document.createElement('A');
    createBooking.href = location.origin + location.pathname + '#/meetings/create';
    var createBookingIcon = document.createElement('I');
    createBookingIcon.className = 'fas fa-check-circle fa-2x';
    createBooking.setAttribute('style', 'color: var(--onschedBlue)');
    createBooking.onclick = () => {
      createTemplateView('create', 'meetings/create', mountCreateMeeting);
    };
    
    var declineBooking = document.createElement('A');
    declineBooking.href = location.origin + location.pathname + '#/meetings/decline';
    var declineBookingIcon = document.createElement('I');
    declineBookingIcon.className = 'fas fa-times-circle fa-2x';
    declineBooking.setAttribute('style', 'color: var(--onschedLightBlue)');
    declineBooking.onclick = () => {
      createTemplateView('decline', 'meetings/decline', mountDeclineMeeting);
    };
    
    createBooking.appendChild(createBookingIcon);
    declineBooking.appendChild(declineBookingIcon);
    
    elRequestsListCol4.appendChild(createBooking);
    elRequestsListCol4.appendChild(declineBooking);
    
    elRequestsListRow.appendChild(elRequestsListCol1);
    elRequestsListRow.appendChild(elRequestsListCol2);
    elRequestsListRow.appendChild(elRequestsListCol3);
    elRequestsListRow.appendChild(elRequestsListCol4);

    elRequestsListBody.appendChild(elRequestsListRow);
  })

  elRequestsList.appendChild(elRequestsListBody);

  elRequestsDiv.appendChild(elRequestsTitle);
  elRequestsDiv.appendChild(elRequestsList);

  // History section
  var elHistoryDiv = document.createElement('DIV');
  elHistoryDiv.className = 'meetings-requests';

  var elHistoryTitle = document.createElement('H4');
  elHistoryTitle.innerText = 'Meeting History';

  var elHistoryList = document.createElement('TABLE');
  elHistoryList.className = 'meetings-requests-list';
  
  var elHistoryListBody = document.createElement('TBODY');

  if (appState.appointments.length) {
    var elHistoryListHeaderRow = document.createElement('TR');
    var requestHeaders = ['Date', 'Requester', 'Company', 'Actions'];

    requestHeaders.map(header => {
      var elHistoryListCol = document.createElement('TH');
      elHistoryListCol.innerText = header;
      
      elHistoryListHeaderRow.appendChild(elHistoryListCol);
    })
  
    elHistoryListBody.appendChild(elHistoryListHeaderRow);
  }
  else {
    elHistoryListBody.innerHTML = '<tr><th class="meetings-requests-no-requests">No upcoming requests</th></tr>';
  }

  appState.appointments.map(appt => {
    var elHistoryListRow = document.createElement('TR');
    
    var elHistoryListCol1 = document.createElement('TD');
    elHistoryListCol1.innerText = appt.date;
    
    var elHistoryListCol2 = document.createElement('TD');
    //elHistoryListCol2.innerHTML = `<img src="${appt.resourceImageUrl}" alt="${appt.name}"/> ${appt.name}`;
    elHistoryListCol2.innerHTML = `<img src="https://onsched.com/assets/img/testimonials/darcie.png" alt="${appt.name}"/> <h5>${appt.name}</h5>`;
    
    var elHistoryListCol3 = document.createElement('TD');
    elHistoryListCol3.innerHTML = appt.customFields.field1.value;
    
    var elHistoryListCol4 = document.createElement('TD');
    
    var createBooking = document.createElement('A');
    createBooking.href = location.origin + location.pathname + '#/meetings/create';
    var createBookingIcon = document.createElement('I');
    createBookingIcon.className = 'fas fa-check-circle fa-2x';
    createBooking.setAttribute('style', 'color: var(--onschedBlue)');
    createBooking.onclick = () => {
      createTemplateView('create', 'meetings/create', mountCreateMeeting);
    };
    
    var declineBooking = document.createElement('A');
    declineBooking.href = location.origin + location.pathname + '#/meetings/decline';
    var declineBookingIcon = document.createElement('I');
    declineBookingIcon.className = 'fas fa-times-circle fa-2x';
    declineBooking.setAttribute('style', 'color: var(--onschedLightBlue)');
    declineBooking.onclick = () => {
      createTemplateView('decline', 'meetings/decline', mountDeclineMeeting);
    };
    
    createBooking.appendChild(createBookingIcon);
    declineBooking.appendChild(declineBookingIcon);
    
    elHistoryListCol4.appendChild(createBooking);
    elHistoryListCol4.appendChild(declineBooking);
    
    elHistoryListRow.appendChild(elHistoryListCol1);
    elHistoryListRow.appendChild(elHistoryListCol2);
    elHistoryListRow.appendChild(elHistoryListCol3);
    elHistoryListRow.appendChild(elHistoryListCol4);

    elHistoryListBody.appendChild(elHistoryListRow);
  })

  elHistoryList.appendChild(elHistoryListBody);

  elHistoryDiv.appendChild(elHistoryTitle);
  elHistoryDiv.appendChild(elHistoryList);
  
  elMeetingsWrapper.appendChild(elMeetingsHeader);
  elMeetingsWrapper.appendChild(elRequestsDiv);
  elMeetingsWrapper.appendChild(elHistoryDiv);
  elMeetingsWrapper.appendChild(generatePagination());

  clearElement(elMeetingsDiv);
  elMeetingsDiv.appendChild(elMeetingsWrapper);
}
