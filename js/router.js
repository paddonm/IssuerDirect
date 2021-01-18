// Define Pages
const pages = {
  meetings: 'meetings',
  createMeeting: 'meetings/create',
  declineMeeting: 'meetings/decline',
  contacts: 'contacts',
  bookmeeting: 'bookmeeting',
}

// Application div
const appDiv = "app";

// Both set of different routes and template generation functions
let routes = {};
let templates = {};

// Register a template (this is to mimic a template engine)
let template = (name, templateFunction) => {
  return templates[name] = templateFunction;
};

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
let route = (path, template) => {
    if (typeof template == "function") {
      return routes[path] = template;
    }
    else if (typeof template == "string") {
      return routes[path] = templates[template];
    }
    else {
      return;
    }
};

// Register the templates.
template('template1', () => {
  var elAppDiv = document.getElementById(appDiv);
  clearElement(elAppDiv);
  setLoading(true);

  new Promise((resolve) => {
    const element = createDiv('appointments', `<div id="appointments"></div>`);
    var elLocation = document.createElement('DIV');
    elLocation.id = 'location';
    
    element.appendChild(elLocation);
    
    elAppDiv.appendChild(element);
    resolve(elAppDiv.appendChild(element));
  })
  .then(() => {
    checkBusinessHours({locationId: '4d28c64a-2d07-4de0-b8f5-730338ed309c'}).then(() => {
      mountAppointments(mountCalendar, {}, { formValues: [{paramName: 'startDate', value: getStartOfMonth(moment())}, { paramName: 'endDate', value: getEndOfMonth(moment())}] });
    })
  });
});

// Create template function
function createTemplateView(elementId, path, mount) {
  const addElement = new Promise((resolve, reject) => {
    template(`template-${elementId}`, () => {
      let elAppDiv = document.getElementById(appDiv);
  
      clearElement(elAppDiv);
      
      const element = createDiv(elementId, `<div id="${elementId}"></div>`);
      
      elAppDiv.appendChild(element);
      resolve(elAppDiv.appendChild(element));
    });

    route(`/${path}`, `template-${elementId}`);
  })

  addElement.then(() => {
    mount();
    detectRoute();
  });
}

// Define the mappings route->template.
route('/', 'template1');

// Generate DOM tree from a string
let createDiv = (id, xmlString) => {
  let d = document.createElement('div');
  d.id = id;
  d.innerHTML = xmlString;
  return d.firstChild;
};

// Helper function to create a link.
let createLink = (title, text, href) => {
  let a = document.createElement('a');
  let linkText = document.createTextNode(text);
  a.appendChild(linkText);
  a.title = title;
  a.href = href;
  return a;
};

// Helper function to add hrefs to element items
const linkToPage = (data) => {
  data.map(e => {
    var elements = document.querySelectorAll(`[data-id="${e.id}"]`);
    
    let href = `/${e.id}`
    if (window.location.hash.slice(2).length)
      href = `/${window.location.hash.slice(2)}` + href
    
      elements[0].href += href;
  })
}

// Detect what step should be rendered
function routeData() {
  let page = window.location.hash.slice(2).replace('#', '');
  let data = { page }
  
  return data;
}

function detectRoute() {
  switch (routeData().page) {
    case pages.meetings:
      createTemplateView('meetings', 'meetings', mountMeetingAppointments);
      break;
      
    case pages.createMeeting:
      createTemplateView('create-meeting', 'meetings/create', mountCreateMeeting);
      break;
      
    case pages.declineMeeting:
      createTemplateView('decline-meeting', 'meetings/decline', mountDeclineMeeting);
      break;
      
    case pages.contacts:
      createTemplateView('contacts', 'contacts', mountContacts);
      break;
      
    case pages.bookmeeting:
      createTemplateView('bookmeeting', 'bookmeeting', mountBookingCalendar);
      break;
    
    default:
      break;
  }
}

detectRoute();

// Give the correspondent route (template) or fail
let resolveRoute = (route) => {
  try {
   return routes[route];
  } catch (error) {
      throw new Error("The route is not defined");
  }
};

// The actual router, get the current URL and generate the corresponding template
let router = () => {
  const url = window.location.hash.slice(1) || "/";
  const routeResolved = resolveRoute(url);
  routeResolved();
};

// For first load or when routes are changed in browser url box.
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
