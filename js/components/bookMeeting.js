var elAppDiv = document.getElementById('app');

const mountContactsModal = () => {
  var elContactsModal;

  if (!document.getElementById('contacts-modal')) {
    elContactsModal = document.createElement('DIV');
    elContactsModal.id = 'contacts-modal';
  }
  else {
    elContactsModal = document.getElementById('contacts-modal');
  }

  clearElement(elContactsModal);

  elContactsModal.className = 'active';
  
  const mountCustomersModalList = () => {
    var elContactsModalForm;
    if (document.getElementById('contacts-modal-form')) {
      elContactsModalForm = document.getElementById('contacts-modal-form');
    }
    elContactsModalForm = document.createElement('FORM');
    elContactsModalForm.id = 'contacts-modal-form';
    elContactsModalForm.onsubmit = e => {
      e.preventDefault();
      elContactsModal.className = '';

      var newContacts = Array.from(e.target).filter(input => input.checked);
      
      updateSelectedContacts(newContacts);
      document.getElementById('search-input').value = newContacts.map(contact => contact.dataset.name);
    }

    var elContactsModalList = document.createElement('TABLE');
    elContactsModalList.className = 'contacts-modal-list';
    
    var elContactsModalListBody = document.createElement('TBODY');
    
    var elHeaderRow = document.createElement('TR');
    var elHeaderCell1 = document.createElement('TH');
    elHeaderCell1.innerText = 'Contact';
    elHeaderCell1.setAttribute('colSpan', '2');
    var elHeaderCell2 = document.createElement('TH');
    elHeaderCell2.innerText = 'Select';
    elHeaderRow.appendChild(elHeaderCell1);
    elHeaderRow.appendChild(elHeaderCell2);
    elContactsModalListBody.appendChild(elHeaderRow);
    
    appState.customers.map(customer => {
      var elRow = document.createElement('TR');
      
      var elImgCell = document.createElement('TD');
      var elIcon = document.createElement('DIV');
      elIcon.className = 'initials-icon';
      customer.name.split(' ').map((name, i) => { if (i <= 2) elIcon.innerText += name.slice(0,1) });
      
      elImgCell.appendChild(elIcon);
      elRow.appendChild(elImgCell);

      var elNameCell = document.createElement('TD');
      elNameCell.innerText = customer.name;
      
      elRow.appendChild(elNameCell);

      var elSelect = document.createElement('INPUT');
      elSelect.setAttribute('type', 'checkbox');
      elSelect.setAttribute('name', customer.id);
      elSelect.dataset.id = customer.id;
      elSelect.dataset.name = customer.name;
      elSelect.dataset.email = customer.email;
      
      var elSelectCell = document.createElement('TD');
      
      elSelectCell.appendChild(elSelect);
      
      elRow.appendChild(elSelectCell);

      elContactsModalListBody.appendChild(elRow);
    })

    elContactsModalList.appendChild(elContactsModalListBody);
    elContactsModalForm.appendChild(elContactsModalList);

    var elContactsModalHeader;

    if (document.getElementById('contacts-modal-header')) {
      elContactsModalHeader = document.getElementById('contacts-modal-header');
    }
    else {
      var elContactsModalHeader = document.createElement('DIV');
      elContactsModalHeader.className = 'contacts-modal-header';
      elContactsModalHeader.id = 'contacts-modal-header';
      elContactsModalHeader.innerHTML = `<div>Contacts <span>(${appState.customersTotal})</span></div>`
      
      elContactsModalClose = document.createElement('BUTTON');
      elContactsModalClose.setAttribute('type', 'submit');
      elContactsModalClose.className = 'contacts-close-btn';
      elContactsModalClose.onclick = () => elContactsModal.className = '';
      elContactsModalHeader.appendChild(elContactsModalClose);
      
      elContactsModalForm.prepend(elContactsModalHeader);
    }

    var elSubmitBtn = document.createElement('BUTTON');
    elSubmitBtn.className = 'submit-btn';
    elSubmitBtn.setAttribute('type', 'submit');
    elSubmitBtn.innerText = 'Done';

    elContactsModalForm.appendChild(elSubmitBtn);

    elContactsModal.appendChild(elContactsModalForm);
    elAppDiv.prepend(elContactsModal);
  }

  if (!document.getElementById('customer')) {
    var elCustomer = document.createElement('DIV');
    elCustomer.id = 'customer';
  
    elAppDiv.prepend(elCustomer);
  }

  mountCustomers(mountCustomersModalList, {}, {});
}

const mountSendButtons = () => {
  var elButtons = document.createElement('UL');
  elButtons.className = 'send-buttons';

  var elCancelBtn = document.createElement('LI');
  elCancelBtn.innerText = 'Cancel';
  elCancelBtn.onclick = () => {
    window.location.assign(location.origin + location.pathname + '#/')
    mountDashboardComponent();
  }
  elButtons.appendChild(elCancelBtn);
  
  var elSendBtn = document.createElement('LI');
  elSendBtn.innerText = 'Send';
  elSendBtn.onclick = (data = {}) => {
    // Add send email logic here


    console.log('Send', data);
  }
  elButtons.appendChild(elSendBtn);
  
  return elButtons;
}

const mountComments = () => {
  var elCommentsWrapper = document.createElement('DIV');

  var elComments = document.createElement('TEXTAREA');
  elComments.className = 'comments';
  elComments.setAttribute('rows', '5');

  var elTitle = document.createElement('P');
  elTitle.innerText = 'Add additional comments:';

  elCommentsWrapper.appendChild(elTitle);
  elCommentsWrapper.appendChild(elComments);
  
  return elCommentsWrapper;
}

const mountTimesList = (timeFrame, date) => {
  var elTimeFrames;
  
  if (document.getElementById('time-frames')) {
    elTimeFrames = document.getElementById('time-frames');
  }
  else {
    elTimeFrames = document.createElement('UL');
    elTimeFrames.id = 'time-frames';
  }

  clearElement(elTimeFrames);

  checkBusinessHours({locationId: '4d28c64a-2d07-4de0-b8f5-730338ed309c'})
    .then(resp => {
      var today = Object.values(resp)[moment(date).day()];
      let startTime = today.startTime;
      let endTime = today.endTime;
      var meridiem;
      
      if (timeFrame === 'Morning') {
        endTime = 1145;
        meridiem = ' am';
      }
      else {
        startTime = 1200;
        meridiem = ' pm';
      }

      for (var i = startTime;i <= endTime;i+=15) {
        if (parseInt(i.toString().slice(-2)) > 45) {
          i+=40;
        }
        
        var elTimeFrame = document.createElement('LI');
        elTimeFrame.innerText = i.toString().slice(0, -2) + ':' + i.toString().slice(-2) + meridiem;
        elTimeFrames.appendChild(elTimeFrame);
      }
    })

  return elTimeFrames;
}

const mountSelectTimeItems = monthDays => {
  var selectTimes;
  
  if (document.getElementById('select-times')) {
    selectTimes = document.getElementById('select-times');
  }
  else {
    selectTimes = document.createElement('DIV');
    selectTimes.id = 'select-times';
  }

  clearElement(selectTimes);
  
  if (monthDays.length) {
    monthDays.map(a => {
      var elSelectTime = document.createElement('H5');
      var elSelectTimeFrame = document.createElement('UL');
      
      var elTimeFramesWrapper = document.createElement('DIV');
      elTimeFramesWrapper.className = 'time-frames';

      elSelectTimeFrame.className = 'select-time';

      ['Morning', 'Afternoon'].map(timeFrame => {
        var elTimeFrame = document.createElement('LI');
        elTimeFrame.innerText = timeFrame;
        elTimeFrame.onclick = e => {
          elTimeFramesWrapper.appendChild(mountTimesList(timeFrame, a));
          var wrapperElements = elSelectTimeFrame.childNodes;
          
          wrapperElements.forEach(wrapperEl => wrapperEl.className = '');
          
          e.target.className = 'selected';
        }
        elSelectTimeFrame.appendChild(elTimeFrame);
      })
      
      elSelectTime.innerText = moment(a).format('MMM DD');
      
      var elTimeSelectorWrapper = document.createElement('DIV');
      elTimeSelectorWrapper.className = 'time-selector';

      elTimeSelectorWrapper.appendChild(elSelectTimeFrame);
      elTimeSelectorWrapper.appendChild(elTimeFramesWrapper);
      
      selectTimes.appendChild(elSelectTime);
      selectTimes.appendChild(elTimeSelectorWrapper)
    })
  }
  else {
    selectTimes.innerHTML = '<span>No dates selected</span>';
  }

  return selectTimes;
}

const bookingContactSearch = () => {
  mountHeader();

  var bookingSearch = document.createElement('DIV');
  bookingSearch.className = 'booking-search';
  
  var elTitle = document.createElement('DIV');
  elTitle.className = 'booking-search-title';
  elTitle.innerHTML = '<h5>Choose Recipient</h5> Enter email or choose from your contacts';

  var elSearchWrapper = document.createElement('DIV');
  elSearchWrapper.className = 'search-wrapper';
  
  var elSearchBar = document.createElement('INPUT');
  elSearchBar.id = 'search-input'
  
  var elSearchBtn = document.createElement('BUTTON');
  elSearchBtn.className = 'search-recipient-btn'
  elSearchBtn.innerHTML = '<i class="fas fa-plus" />'

  var elViewContacts = document.createElement('BUTTON');
  elViewContacts.className = 'view-contacts-btn';
  elViewContacts.innerText = 'View Contacts';
  elViewContacts.onclick = () => mountContactsModal();

  elSearchWrapper.appendChild(elSearchBar);
  elSearchWrapper.appendChild(elSearchBtn);
  elSearchWrapper.appendChild(elViewContacts);
  
  bookingSearch.appendChild(elTitle);
  bookingSearch.appendChild(elSearchWrapper);
  
  return bookingSearch;
}

const mountDateSelection = () => {
  var dateSelection = document.createElement('DIV');
  dateSelection.className = 'date-selection';

  var titleDescription = document.createElement('DIV');
  titleDescription.className = 'title-description';
  titleDescription.innerHTML = "<h5>Choose Date(s)</h5><p>Select which day, week, or month you'd like to send.</p>"

  dateSelection.appendChild(titleDescription);

  return dateSelection;
}

const mountCalendarWrapper = () => {
  var calendarWrapper = document.createElement('DIV');
  calendarWrapper.className = 'calendar-wrapper';

  var elDatepicker = document.createElement('INPUT');
  elDatepicker.setAttribute('type', 'date');
  elDatepicker.onchange = e => {
    updateDate(e.target.value).then(() => {
      mountBookingCalendar();
    })
  }

  var elMonthTitle = document.createElement('H5');
  elMonthTitle.innerText = moment(appState.date).format('MMMM');

  calendarWrapper.appendChild(elMonthTitle);
  calendarWrapper.appendChild(elDatepicker);

  var elCalendar = document.createElement('DIV');
  
  var elCalendarTable = document.createElement('TABLE');
  var elCalendarTableBody = document.createElement('TBODY');
  elCalendarTable.appendChild(elCalendarTableBody);

  elTableHeaders = document.createElement('DIV');
  elTableHeaders.className = 'calendar-table-headers';
  var headerDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  headerDays.map(headerDay => {
    var elDay = document.createElement('DIV');
    elDay.innerText = headerDay.slice(0,1);
    elTableHeaders.appendChild(elDay);
  })

  elCalendar.appendChild(elTableHeaders);

  const startWeek = moment(appState.date).startOf('month').week();
  const endWeek = moment(appState.date).endOf('month').week();

  var monthDays = [];

  let calendar = [];
  for(var week = startWeek; week<endWeek;week++){
    calendar.push({
      week:week,
      days:Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day'))
    })
  }
  
  calendar.map(calWeek => {
    var elCalRow = document.createElement('TR');

    calWeek.days.map(calDay => {
      var elCalDay = document.createElement('TD');
      var calDayFormatted = calDay.format('YYYY-MM-DD')

      elCalDay.dataset.date = calDayFormatted;
      elCalDay.innerText = calDay.format('D');

      if (calDay.diff(moment()) < 0) {
        elCalDay.className = 'past';
      }
      else {
        elCalDay.onclick = e => {
          if (e.target.className.length) {
            e.target.className = '';
          }
          else {
            e.target.className = 'selected';
          }
          
          var newDays = monthDays;
      
          if (monthDays.includes(calDayFormatted)) {
            newDays = monthDays.filter(mD => mD !== calDayFormatted)
          }
          else {
            newDays.push(calDayFormatted);
          }    
  
          monthDays = newDays;
  
          calendarWrapper.appendChild(mountSelectTime(monthDays))
        }
      }

      if (calDay.month() !== moment(appState.date).month()) {
        elCalDay.className = 'out-of-month';
      }

      elCalRow.appendChild(elCalDay);
    })

    elCalendarTableBody.appendChild(elCalRow);
  })

  elCalendar.appendChild(elCalendarTable);
  calendarWrapper.appendChild(elCalendar);
  
  return calendarWrapper;
}

const mountSelectTime = monthDays => {
  var selectTime;

  if (document.getElementById('select-time')) {
    selectTime = document.getElementById('select-time');
    clearElement(selectTime);
  }
  else {
    selectTime = document.createElement('DIV');
    selectTime.className = 'select-time';
    selectTime.id = 'select-time';
  }

  var title = document.createElement('H5');
  title.innerText = 'Select Time(s)';

  selectTime.appendChild(title);
  selectTime.appendChild(mountSelectTimeItems(monthDays));

  return selectTime;
}

const mountBookingCalendar = () => {
  updateNavItem(navItems[3]);
  checkElements('#bookmeeting').then(resp => {
    var elBookMeeting = resp[0];

    clearElement(elBookMeeting)

    // checkBusinessHours({locationId: appState.locationId}).then(() => {
    //   resp => console.log(resp)
    // })

    elBookMeeting.appendChild(bookingContactSearch());
    elBookMeeting.appendChild(mountDateSelection());
    elBookMeeting.appendChild(mountCalendarWrapper());
    elBookMeeting.appendChild(mountSelectTime([]));
    elBookMeeting.appendChild(mountComments());
    elBookMeeting.appendChild(mountSendButtons());
  })
};