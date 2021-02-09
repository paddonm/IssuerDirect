const elHeader = document.getElementById('header');

const navItems = [
  { label: 'Welcome back', button: 'Home', icon: 'fal fa-home', path: '', component: mountDashboardComponent },
  { label: 'Meetings', button: 'Meetings', icon: 'fal fa-users', path: 'meetings', component: mountMeetingAppointments },
  { label: 'Contacts', button: 'Contacts', icon: 'fal fa-address-card', path: 'contacts', component: mountContacts },
  { label: 'Create Meeting', button: 'Book meeting', icon: 'fal fa-address-card', path: 'bookmeeting', component: mountBookingCalendar }
]

var selectedNavItem = navItems[0].label;

const updateNavItem = item => {
  selectedNavItem = item.label;
}

const mountHeader = () => {
  clearElement(elHeader);
  var elTitle = document.createElement('H1');
  elTitle.innerText = selectedNavItem;

  elHeader.appendChild(elTitle)

  var headerItems = document.createElement('UL');

  navItems.map(item => {
    var headerItem = document.createElement('LI');
    var headerItemLink = document.createElement('A');
    
    let href = location.origin + location.pathname + '#/' + item.path;
    
    headerItemLink.href = href;

    var headerItemIcon = document.createElement('I');
    headerItemLink.onclick = () => {
      createTemplateView(item.path, item.path, item.component);
    }

    headerItemIcon.className = item.icon;
    headerItemLink.appendChild(headerItemIcon);

    headerItemLink.innerHTML = headerItemLink.innerHTML + ' ' + item.button;
    headerItem.appendChild(headerItemLink);

    if (item.button.length) {
      if (selectedNavItem === navItems[0].label) {
        if (navItems[0].label !== item.label) {
          headerItems.appendChild(headerItem);
        }
      }
      else {
        headerItems.appendChild(headerItem);
      }
    }
  })

  elHeader.appendChild(headerItems);
}