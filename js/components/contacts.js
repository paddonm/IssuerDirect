const customerActions = () => {
  var actions = document.createElement('DIV');
  
  var elCreateContact = document.createElement('A');
  elCreateContact.className = 'create-contact-button';
  elCreateContact.innerHTML = "<i class='fal fa-user-plus'></i> Create Contact"
  
  var elSearchBar = document.createElement('INPUT');
  elSearchBar.className = 'search-contacts-input';
  elSearchBar.setAttribute('placeholder', 'Search contacts')

  actions.appendChild(elCreateContact);
  actions.appendChild(elSearchBar);
  
  return actions;
}

const mountContacts = () => {
  var elAppDiv = document.getElementById('app');
  var elCustomers = document.createElement('DIV');
  elCustomers.id = 'customers';
  mountCustomers(() => {}, {}, {});
  clearElement(elAppDiv);
  updateNavItem(navItems[2]);
  mountHeader();
  elAppDiv.appendChild(customerActions());  
  elAppDiv.appendChild(elCustomers);
}
