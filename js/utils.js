const clearElement = (el) => {
  el.innerHTML = "";
}

const getStartOfWeek = date => moment(date).startOf('week').format('YYYY-MM-DD');
const getEndOfWeek = date => moment(date).add(7, 'days').startOf('week').format('YYYY-MM-DD');
const getStartOfMonth = date => moment(date).startOf('month').format('YYYY-MM-DD');
const getEndOfMonth = date => moment(date).endOf('month').format('YYYY-MM-DD');

const resolveElements = () => {
  return new Promise(resolve => {
      requestAnimationFrame(resolve); //faster than set time out
  });
}

const checkElements = selector => {
  if (!document.querySelectorAll(selector).length)
      return resolveElements().then(() => checkElements(selector));
  
  else return Promise.resolve(document.querySelectorAll(selector));
}

const formatDate = date => {
  const formatted = new Date(date).toISOString().slice(0,10)
  return formatted
}

const updateDate = date => {
  return new Promise(resolve => {
    resolve(appState.date = formatDate(date))
  })
}

const updateSelectedContacts = contacts => {
  return new Promise(resolve => {
    resolve(appState.contactsSelected = contacts)
  })
}

const updateBusinessHours = businessHours => {
  return new Promise(resolve => {
    resolve(appState.businessHours = businessHours)
  })
}

var businessHoursLoading = false;

const updatePage = page => {
  return new Promise(resolve => {
    resolve(appState.page = page)
  })
}

const updateAppointments = appointments => {
  appState.appointments = appointments.data;
  appState.total = appointments.total;
  return new Promise(resolve => {
    resolve(appState)
  })
}

const updateMeetings = appointments => {
  appState.meetings = appointments.data;
  appState.meetingsTotal = appointments.total;
  return new Promise(resolve => {
    resolve(appState)
  })
}

const updateCustomers = customers => {
  appState.customers = customers.data;
  appState.customersTotal = customers.total;
  return new Promise(resolve => {
    resolve(appState)
  })
}

const setLoading = status => {
  var elAppDiv = document.getElementById('app');
  
  var elLoading = document.createElement('DIV');
  elLoading.id = 'loader-img'
  elLoading.innerHTML = "<img src='https://onsched.com/assets/img/logos/issuerdirectlogo2.gif' />"
  
  if (status) {
    if (!document.getElementById('loader-img')) {
      elAppDiv.appendChild(elLoading);
      elAppDiv.className = 'loading';
    }
  }
  else {
    checkElements('#loader-img').then(resp => {
      if (resp.length) {
        elAppDiv.removeChild(resp[0]);
        elAppDiv.className = '';
      }
    })
  }
}

const generatePagination = () => {
  var elPagination = document.createElement('DIV')
  elPagination.className = 'pagination-list meetings-pagination';
  
  let pages = parseInt((appState.total)/5);
  
  if ((appState.total+1)%10) {
    pages += 1;
  }
  
  var elPaginationBack = document.createElement('DIV');
  elPaginationBack.innerHTML = '<i class="fad fa-arrow-left"></i>';
  elPaginationBack.onclick = e => {
    updatePage(1).then(() => {
      checkElements('pagination-item').then(resp => {
        resp[0].className = 'pagination-item selected'
        mountAppointments(mountMeetings, {}, params);
      });
    })
  }

  elPagination.appendChild(elPaginationBack);
  
  for (page = 1;page <= pages;page++) {
    var elPaginationItem = document.createElement('DIV');
    elPaginationItem.innerText = page;
    
    if (page === appState.page) {
      elPaginationItem.className = 'pagination-item selected';
    }
    else {
      elPaginationItem.className = 'pagination-item';
    }
    
    let params = {
      limit: '5',
      offset: ((page - 1) * 5).toString(),
      formValues: [
        { paramName: 'startDate', value: getStartOfMonth(new Date()) },
        { paramName: 'endDate', value: getEndOfMonth(new Date()) }
      ]
    }
    
    var elPageItems = document.querySelectorAll('.pagination-item');
    for(var i = elPageItems.length - 1; i >= 0; --i) {
        elPageItems[i].className = "pagination-item";
    } 
    
    elPaginationItem.onclick = (e) => {
      updatePage(params.offset/5+1).then(() => {
        e.target.classList.add('selected');
        mountAppointments(mountMeetings, {}, params);
      })
    };

    elPagination.appendChild(elPaginationItem);
  }

  var elPaginationForward = document.createElement('I');
  elPaginationForward.className = 'fad fa-arrow-right';
  elPaginationForward.onclick = () => {
    updatePage(pages).then(() => {
      checkElements('pagination-item').then(resp => {
        resp[0].className = 'pagination-item selected'
        mountAppointments(mountMeetings, {}, params);
      });
    })
  }

  elPagination.appendChild(elPaginationForward);
  
  return elPagination;
}
