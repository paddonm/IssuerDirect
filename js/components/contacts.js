const customerActions = () => {
  var actions = document.createElement('DIV');
  actions.className = 'contacts-actions';

  var elCreateContact = document.createElement('A');
  elCreateContact.className = 'create-contact-button';
  elCreateContact.innerHTML = "<i class='fal fa-user-plus'></i> Create Contact"
  
  var elSearch = document.createElement('FORM');
  elSearch.onsubmit = e => {
    e.preventDefault();
    let searchText = e.srcElement.childNodes[0].value;
    mountCustomers(() => elContacts.appendChild(mountCustomersList()), {}, { email: searchText });
  }
  var elSearchBar = document.createElement('INPUT');
  elSearchBar.className = 'search-contacts-input';
  elSearchBar.setAttribute('placeholder', 'Search contacts by email')
  
  elSearch.appendChild(elSearchBar);

  actions.appendChild(elCreateContact);
  actions.appendChild(elSearch);
  
  return actions;
}

const mountCustomersList = () => {
  var customersList;
  if (document.getElementById('contacts-list')) {
    customersList = document.getElementById('contacts-list');
  }
  else {
    customersList = document.createElement('TABLE');
    customersList.className = 'contacts-list';
    customersList.id = 'contacts-list';
  }

  clearElement(customersList);

  var customersListBody = document.createElement('TBODY');

  var elHeaderItems = document.createElement('TR');
  
  ['Name', 'Email', 'Company'].map(item => {
    var elHeaderItem = document.createElement('TH');
      elHeaderItem.innerText = item;
      elHeaderItems.appendChild(elHeaderItem);
  });

  customersListBody.appendChild(elHeaderItems);

  [...appState.customers].map(customer => {
    var elCustomerItem = document.createElement('TR');

    [customer.name, customer.email, customer.companyName].map(cell => {
      var elCell = document.createElement('TD');
      elCell.innerText = cell;
      elCustomerItem.appendChild(elCell);
    })

    customersListBody.appendChild(elCustomerItem);
    customersList.appendChild(customersListBody);
  })

  return customersList;
}

const mountContacts = () => {
  var elAppDiv = document.getElementById('app');
  clearElement(elAppDiv);
  
  var elContacts = document.createElement('DIV');
  elContacts.id = 'contacts';

  updateNavItem(navItems[2]);
  mountHeader();
  
  var elCustomers = document.createElement('DIV');
  elCustomers.id = 'customer';
  
  elContacts.appendChild(customerActions());  
  
  elAppDiv.appendChild(elCustomers);
  elAppDiv.appendChild(elContacts);

  mountCustomers(() => elContacts.appendChild(mountCustomersList()), {}, {});
}
