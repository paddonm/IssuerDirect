var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', ' '];
const serviceColors = ['#145489','#be5928','rgb(111 178 237)','rgb(48 56 60)']
const distinct = (value, i, self) => self.indexOf(value) === i;
var elCalendar = document.createElement('DIV');

const mountDashboardComponent = () => {
  var elAppDiv = document.getElementById('app');
  clearElement(elAppDiv);

  var elAppointments = document.createElement('DIV')  ;
  elAppointments.id = 'appointments';

  elAppDiv.appendChild(elAppointments);

  checkBusinessHours({locationId: '4d28c64a-2d07-4de0-b8f5-730338ed309c'}).then(() => {
    mountAppointments(mountCalendar, {}, { formValues: [{paramName: 'startDate', value: getStartOfMonth(moment())}, { paramName: 'endDate', value: getEndOfMonth(moment())}] });
  })
}

const generateWidgets = () => {
  var elWidgetWrapper = document.createElement('DIV');
  elWidgetWrapper.className = 'calendar-widget-wrapper';
  
  var elChartsWrapper = document.createElement('DIV');
  elChartsWrapper.className = 'calendar-charts-wrapper';

  var elChartsWidget = document.createElement('DIV');
  elChartsWidget.className = 'calendar-charts-widget';
  
  elChartsWidgetTitle = document.createElement('H4');
  elChartsWidgetTitle.innerText = 'You have most of your meetings on:';
  
  var elBarChart = document.createElement('DIV');
  elBarChart.className = 'calendar-barchart-widget';
  
  elChartsWidget.appendChild(elChartsWidgetTitle);
  
  var counts = {};
  
  var appts = appState.appointments.map(a => moment(a.date).format('YYYY-MM-DD'));
  
  for (var i = 0; i < appts.length; i++) {
    var num = appts[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  
  var elDoughnutWidget = document.createElement('DIV');
  elDoughnutWidget.className = 'calendar-doughnut-widget';
  var elDoughnutChart = document.createElement('DIV');
  elDoughnutChart.className = 'calendar-doughnut-chart';
  var elDoughnutLabels = document.createElement('DIV');
  elDoughnutLabels.className = 'calendar-doughnut-labels';
  elDoughnutLabels.innerHTML = '<div>am</div><div>pm</div>';

  elDoughnutWidget.appendChild(elDoughnutChart);
  elDoughnutWidget.appendChild(elDoughnutLabels);
  
  var percentagePM = 0;
  var meridAM = appState.appointments.map(a => a.time < 1200).length;
  var meridPM = appState.appointments.map(a => a.time >= 1200).length;
  var meridTotal = meridAM + meridPM;
  percentagePM = (meridPM/meridTotal) * 100;

  var addBorder = [];

  if (percentagePM > 0) {
    if (percentagePM <= 25) {
      addBorder = ['top'];
    }
    else if (percentagePM <= 50) {
      addBorder = ['top', 'right'];
    }
    else if (percentagePM <= 75) {
      addBorder = ['top', 'right', 'bottom'];
    }
    else {
      addBorder = ['top', 'right', 'bottom', 'left'];
    }
  }

  let borderStyle = addBorder.map(border => `border-${border}: 10px solid #145489;`).join('');

  elDoughnutChart.setAttribute('style', `${borderStyle}`);

  for (var dayNum = 0;dayNum <= 6;dayNum++) {
    var elBarWrapper = document.createElement('DIV');
    var elBar = document.createElement('DIV');
    elBar.className = 'calendar-barchart-widget-day';

    var colors = ['#7bbdf7', '#1f88e5', '#1f88e5', '#7bbdf7', '#06467f', '#1f88e5', '#7bbdf7'];

    elBar.setAttribute('style', `height: ${counts[moment(appState.date).startOf('week').add(dayNum, 'days').format('YYYY-MM-DD')]/24*100}px;background-color: ${colors[dayNum]}`)

    var elBarTitle = document.createElement('H5');
    elBarTitle.innerText = days[dayNum].slice(0,1);
    
    elBarWrapper.appendChild(elBar);
    elBarWrapper.appendChild(elBarTitle);
    
    elBarChart.appendChild(elBarWrapper);
  }
  
  var elContactsWidget = document.createElement('DIV');
  elContactsWidget.className = 'calendar-contacts-widget';
  elContactsWidget.innerHTML = `You have <span class="contacts-widget-number">13</span> new contacts`;
  
  
  elChartsWrapper.appendChild(elBarChart);
  elChartsWrapper.appendChild(elDoughnutWidget);
  elChartsWrapper.appendChild(elContactsWidget);
  elChartsWidget.appendChild(elChartsWrapper);
  elWidgetWrapper.appendChild(elChartsWidget);

  return elWidgetWrapper;
}

const mountCalendarTable = () => {
  clearElement(elCalendar);
  var elCalendarTable = document.createElement('TABLE');
  var elCalendarBody = document.createElement('TBODY');
  
  var d = new Date();
  var currentTime = parseInt(d.toString().slice(16, 18));

  let dayOfWeek = moment(appState.date).format('ddd');

  const calendarTableRow = day => {
    var elRow = document.createElement('TR');

    var elHeading = document.createElement('TH');
    elHeading.innerText = day;

    elRow.appendChild(elHeading);

    var hours = []
    for (var i = 0; i < 24; i++) {
      var displayTime

      if (i === 0) displayTime = '12 am';
      else if (i <= 12) displayTime = `${i} ${i < 12 ? 'am' : 'pm'}`;
      else if (i === 24) displayTime = '12';
      else displayTime = `${i - 12} ${i < 12 ? 'am' : 'pm'}`;

      hours.push({ meridiem: i <= 12 ? 'am' : 'pm', time: i, displayTime });
    }
    
    let currentDate = moment(appState.date).startOf('week').add(days.indexOf(day), 'days').format('YYYY-MM-DD')

    hours.map(hour => {
      var elHourColumn = document.createElement('TD');

      if (appState.calendarType === 'W' && day === days[days.length - 1]) {
        elHourColumn.innerText = hour.displayTime;
      }
      else if (appState.calendarType === 'D' && day === ' ') {
        elHourColumn.innerText = hour.displayTime;
      }

      const services = appState.appointments.map(a => a.serviceId).filter(distinct);
      
      appState.appointments.map(appt => {
        if (parseInt(appt.time / 100) === hour.time) {
          if (new Date(appt.startDateTime).toString().slice(0, 3) === day) {
            if (currentDate === moment(appt.date).format('YYYY-MM-DD')) {
              var elAppt = document.createElement('DIV');
              elAppt.className = 'appointment';
              var elTooltip = document.createElement('DIV');
              elTooltip.className = 'tooltip';
              elTooltip.innerText = appt.duration + ` min ${appt.serviceName} with ` + appt.name;
              // Style Appointment
              let bgColor = serviceColors[services.indexOf(appt.serviceId)];
              if (appt.time % 100 !== 0) {
                elAppt.setAttribute('style', `background-color: ${bgColor}; width: ${appt.duration / 60 * 150 - 10}px; float: right`);
              }
              else {
                elAppt.setAttribute('style', `background-color: ${bgColor}; width: ${appt.duration / 60 * 150 - 10}px; display: inline-block`);
              }

              var elName = document.createElement('H5');
              elName.innerText = appt.name;

              elAppt.appendChild(elName);
              elAppt.appendChild(elTooltip);
              elHourColumn.appendChild(elAppt);
            }
          }
        }
      })
      if (appState.businessHours.mon) {
        let todaysHours = Object.values(appState.businessHours)[
                              Object.keys(appState.businessHours)
                                    .indexOf(
                                      Object.keys(appState.businessHours)
                                            .filter(d => d === day.toLowerCase())[0]
                                    )
                              ];

        if (todaysHours) {
          if ( hour.time < (todaysHours.startTime/100) ||
                hour.time > (todaysHours.endTime/100) ||
                !todaysHours.isOpen
              ) {
            elHourColumn.classList.add('closed');
          }
        }
      }
      else {
        checkBusinessHours({locationId: '4d28c64a-2d07-4de0-b8f5-730338ed309c'})
      }
      
      let currentWeek = moment().startOf('week').format('YYYY-MM-DD') === moment(new Date(appState.date)).startOf('week').format('YYYY-MM-DD');

      if (currentWeek) {
        if (dayOfWeek === day) {
          elRow.setAttribute('style', 'background-image: linear-gradient(to right, #cccccc 33%, rgba(255,255,255,0) 0%); background-position: top; background-size: 20px 1px; background-repeat: repeat-x;');
        }
        
        if (hour.time === currentTime) {
          elHourColumn.classList.add('current');
          setTimeout(() => {
            elCalendarTable.scrollLeft = currentTime * 150;
          }, 500);
        }
      }
      else if (appState.appointments.length > 0) {
        var selectedDay = new Date(appState.appointments[0].startDateTime);
        var firstApptTime = parseInt(selectedDay.toString().slice(16, 18));

        setTimeout(() => {
          elCalendarTable.scrollLeft = firstApptTime * 150;
        }, 500);

      }

      elRow.appendChild(elHourColumn);
    })

    elCalendarBody.appendChild(elRow);
  }

  const monthCalendar = () => {
    var elCalendar = document.createElement('DIV');
  
    var elCalendarTable = document.createElement('TABLE');
    elCalendarTable.className = 'calendar-table';
    var elCalendarTableBody = document.createElement('TBODY');
    elCalendarTable.appendChild(elCalendarTableBody);
  
    elTableHeaders = document.createElement('TR');
    var headerDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    headerDays.map(headerDay => {
      var elDay = document.createElement('TD');
      elDay.className = 'month-day-headers';
      elDay.innerText = headerDay;
      elTableHeaders.appendChild(elDay);
    })
  
    elCalendarTableBody.appendChild(elTableHeaders);
  
    const startWeek = moment(appState.date).startOf('month').week();
    const endWeek = moment(appState.date).endOf('month').week();
  
    let calendar = []
    for(var week = startWeek; week<endWeek;week++){
      calendar.push({
        week:week,
        days:Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day'))
      })
    }

    calendar.map(calWeek => {
      var elCalRow = document.createElement('TR');
      calWeek.days.map((calDay, i) => {
        if (i !== 0 && i !== (calWeek.days.length - 1)) {
          var elCalDay = document.createElement('TD');
          elCalDay.innerText = calDay.format('D');

          if (calDay.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            elCalDay.className = 'today';
          }
          
          //console.log(appState.appointments.map(a => moment(a.date).format('YYYY-MM-DD')), calDay.format('YYYY-MM-DD'))
          var daysAppts = appState.appointments.filter(appt => moment(appt.date).format('YYYY-MM-DD') === calDay.format('YYYY-MM-DD'))
          daysAppts.map(dayAppt => {
            const services = appState.appointments.map(a => a.serviceId).filter(distinct);
            let bgColor = serviceColors[services.indexOf(dayAppt.serviceId)];
            var elDayAppt = document.createElement('DIV');
            elDayAppt.setAttribute('style', `background-color: ${bgColor}; width: ${dayAppt.duration / 60 * 50 - 10}px; float: right`);
            elDayAppt.className = 'appt';
            elCalDay.appendChild(elDayAppt);
          })
  
          elCalRow.appendChild(elCalDay);
        }
      })
      
      elCalendarTableBody.appendChild(elCalRow);
    })
    
    var elTimeRow = document.createElement('TR');
    
    for (var idx=0;idx < 5;idx++) {
      elTimeDay = document.createElement('TD');
      elTimesWrap = document.createElement('DIV');
      elTimesWrap.className = 'month-times-wrap';
      ['8am', '12pm', '5pm'].map(time => {
        var elTime = document.createElement('DIV');
        elTime.innerText = time;
        elTimesWrap.appendChild(elTime);
      })
      
      elTimeDay.appendChild(elTimesWrap);
      elTimeRow.appendChild(elTimeDay);
    }

    elCalendarTableBody.appendChild(elTimeRow);
  
    elCalendar.appendChild(elCalendarTable);

    elCalendarBody.appendChild(elCalendar)
  }

  var elDayHeaders = document.createElement('DIV');
  elDayHeaders.className = 'onsched-day-col';

  switch(appState.calendarType) {
    case 'D': 
      var dayHeaders = [dayOfWeek, ' ']
      dayHeaders.map(day => {
        var dayHeader = document.createElement('DIV');
        dayHeader.innerText = day;
        elDayHeaders.appendChild(dayHeader);
      })
      dayHeaders.map(day => {
        calendarTableRow(day);
      })
      break;
      
    case 'M': 
      monthCalendar();
      break;

    default: 
      days.map(day => {
        var dayHeader = document.createElement('DIV');
        dayHeader.innerText = day;
        elDayHeaders.appendChild(dayHeader);
      })
      days.map(day => {
        calendarTableRow(day);
      })
      break;
  }
  
  elCalendar.appendChild(elDayHeaders);
  elCalendarTable.appendChild(elCalendarBody);
  elCalendar.appendChild(elCalendarTable);
  
  return elCalendar
}

const mountCalendar = () => {
  var elDashboardDiv = document.getElementById('dashboard');

  var elCalendarTagWrapper = document.createElement('DIV');
  elCalendarTagWrapper.className = 'calendar-tag-wrapper';
  
  var elCalendarWrapper = document.createElement('DIV');
  elCalendarWrapper.className = 'calendar-wrapper';
  elCalendarWrapper.id = 'calendarWrapper';

  var elCalendarNav = document.createElement('DIV');
  elCalendarNav.className = 'calendar-nav';

  const getAppointmentsParams = date => {
    return {
      formValues: [
        { paramName: 'startDate', value: getStartOfMonth(date) },
        { paramName: 'endDate', value: getEndOfMonth(date) }
      ]
    }
  }

  let today = new Date(new Date().toString().slice(4, 15)).toISOString().slice(0, 10);

  var elCalendarNavToday = document.createElement('I');
  elCalendarNavToday.className = 'fal fa-calendar-check';
  elCalendarNavToday.onclick = () => {
    updateDate(today).then(() => mountAppointments(mountCalendarTable, {}, getAppointmentsParams(appState.date)))
  }

  var elCalendarNavInput = document.createElement('INPUT');
  elCalendarNavInput.setAttribute('type', 'date');
  elCalendarNavInput.onchange = e => {
    updateDate(new Date(e.target.value))
      .then(() => {
        mountAppointments(mountCalendar, {}, getAppointmentsParams(moment(e.target.value)));
      })
  }
  
  let navigateDate = 7
  let navigateType = 'days'

  const checkNavigation = () => {
    switch (appState.calendarType) {
      case 'D':
        navigateDate = 1;
        navigateType = 'days';
        break;
    
      case 'W':
        navigateDate = 7;
        navigateType = 'days';
        break;
    
      case 'M':
        navigateDate = 1;
        navigateType = 'months';
        break;
    
      default:
        break;
    }
  }

  checkNavigation();

  var elCalendarNavLeft = document.createElement('I');
  elCalendarNavLeft.className = 'fad fa-arrow-left';
  elCalendarNavLeft.onclick = () => {
    checkNavigation();
    updateDate(new Date(moment(appState.date).subtract(navigateDate, navigateType)))
      .then(() => {
        mountAppointments(mountCalendar, {}, getAppointmentsParams(appState.date));
      })
  };
  var elCalendarNavRight = document.createElement('I');
  elCalendarNavRight.className = 'fad fa-arrow-right';
  elCalendarNavRight.onclick = () => {
    checkNavigation();
    updateDate(new Date(moment(appState.date).add(navigateDate, navigateType)))
      .then(() => {
        mountAppointments(mountCalendar, {}, getAppointmentsParams(appState.date));
      })
  };

  const calendarSwitches = ['Day', 'Week', 'Month']

  var elDWMSwitch = document.createElement('UL');
  elDWMSwitch.className = 'onsched-calendar-dwm-switch';

  const dWMAction = (e, calendarType) => {
    appState.calendarType = calendarType;
    elDWMSwitch.getElementsByClassName('active')[0].className= ''
    e.target.className = 'active';
    elCalendarWrapper.appendChild(mountCalendarTable(calendarType));
  }

  calendarSwitches.map(calSwitch => {
    var elCalSwitchTab = document.createElement('LI');
    elCalSwitchTab.innerText = calSwitch;
    elCalSwitchTab.onclick = e => dWMAction(e, calSwitch.slice(0,1));
    
    if (calSwitch.slice(0,1) === appState.calendarType) {
      elCalSwitchTab.className = 'active';
    }
    
    elDWMSwitch.appendChild(elCalSwitchTab);
  })

  var elCalendarControls = document.createElement('DIV');
  elCalendarControls.className = 'onsched-calendar-controls';

  var elCalendarDate = document.createElement('H3');
  elCalendarDate.innerText = moment(appState.date).toString().slice(4, 15);

  elCalendarControls.appendChild(elCalendarDate);
  elCalendarControls.appendChild(elCalendarNavToday);
  elCalendarControls.appendChild(elCalendarNavInput);
  elCalendarControls.appendChild(elCalendarNavLeft);
  elCalendarControls.appendChild(elCalendarNavRight);
  elCalendarNav.appendChild(elCalendarControls);
  elCalendarNav.appendChild(elDWMSwitch);

  var elBookBtn = document.createElement('DIV');
  elBookLink = document.createElement('A');
  elBookLink.innerText = 'Book Meeting';
  elBookLink.href = location.origin + location.pathname + '#/' + 'bookmeeting'
  elBookLink.onclick = () => createTemplateView('bookmeeting', 'bookmeeting', mountBookingCalendar);
  elBookIcon = document.createElement('I');
  elBookIcon.className = 'far fa-calendar-alt fa-2x';
  elBookBtn.className = "book-btn";
  elBookBtn.appendChild(elBookLink);
  elBookBtn.appendChild(elBookIcon);
  
  elCalendarWrapper.appendChild(elCalendarNav);
  elCalendarWrapper.appendChild(mountCalendarTable('W'));

  clearElement(elDashboardDiv);
  elCalendarTagWrapper.appendChild(elBookBtn);
  elCalendarTagWrapper.appendChild(elCalendarWrapper);
  elDashboardDiv.appendChild(elCalendarTagWrapper);

  var issuerDirectLogo = document.createElement('IMG');
  issuerDirectLogo.src = 'https://onsched.com/assets/img/logos/issuerdirect.png';
  issuerDirectLogo.setAttribute('style', 'margin: 20px auto;display: block;')
  
  elDashboardDiv.appendChild(generateWidgets());
  elDashboardDiv.appendChild(issuerDirectLogo);
}