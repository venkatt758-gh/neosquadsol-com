import './styles/brand.css';
import './styles/main.css';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const services = {
  build: {
    title: 'Better foundations. More possibilities.',
    description: 'Explore how well-designed websites, applications, and modern workflows could help your business move forward.',
    points: ['Web and application experiences', 'Workflow and system integration', 'Maintainable, business-focused solutions'],
  },
  ai: {
    title: 'Less hype. More useful intelligence.',
    description: 'Explore where AI could add real value, with human oversight, clear goals, and responsible handling of information.',
    points: ['AI opportunity discovery', 'Human-reviewed workflow assistance', 'Practical experiments before scaling'],
  },
  deliver: {
    title: 'The right thinking. A connected squad.',
    description: 'Explore the blend of technical skills, AI fluency, and collaboration your challenge needs. Let us discuss the right engagement for your project.',
    points: ['Understand the skills your project needs', 'Connect people and technical direction', 'Keep learning and collaboration central'],
  },
};

const tabs = [...document.querySelectorAll('[data-service]')];
function activateTab(tab) {
  const service = services[tab.dataset.service];
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  }
  document.querySelector('#service-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#service-title').textContent = service.title;
  document.querySelector('#service-description').textContent = service.description;
  document.querySelector('#service-points').replaceChildren(...service.points.map((point) => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      activateTab(tabs[next]);
      tabs[next].focus();
    }
  });
}

for (const link of document.querySelectorAll('[data-enquiry]')) {
  link.addEventListener('click', () => {
    document.querySelector('#interest').value = link.dataset.enquiry;
  });
}

const form = document.querySelector('#enquiry-form');
form.addEventListener('submit', (event) => {
  const data = new FormData(form);
  const fields = ['name', 'message'];
  for (const field of fields) {
    const input = form.elements.namedItem(field);
    input.setCustomValidity(data.get(field).trim() ? '' : 'Please enter more than spaces.');
  }
  if (!form.reportValidity()) {
    event.preventDefault();
    return;
  }
  form.elements.namedItem('_subject').value = `NeoSquad enquiry: ${data.get('interest')}`;
});
for (const input of form.querySelectorAll('input, textarea')) {
  input.addEventListener('input', () => input.setCustomValidity(''));
}
document.querySelector('#year').textContent = String(new Date().getFullYear());
