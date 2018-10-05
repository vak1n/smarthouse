import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/menu.json')
    .then(response => response.json())
    .then(json => {
      const menuNodes = document.querySelectorAll('.menu__list');
      for (let i = 0; i < menuNodes.length; i += 1) {
        json.links.forEach(link => {
          const itemNode = menuNodes[i].getElementsByTagName('template')[0].content.cloneNode(true);
          const linkNode = itemNode.querySelector('a');
          linkNode.href = link.href;
          linkNode.textContent = link.name;
          if (link.selected) {
            linkNode.classList.add('menu__link--selected');
          }
          menuNodes[i].appendChild(itemNode);
        });
      }
    });

  document.querySelector('.menu__burger').addEventListener('click', event => {
    event.stopPropagation();
    document.querySelector('.menu__wrapper').classList.toggle('menu__wrapper--show');
  });

  document.querySelector('.page').addEventListener('click', event => {
    event.stopPropagation();
    document.querySelector('.menu__wrapper').classList.remove('menu__wrapper--show');
  });

  document.querySelector('.menu__wrapper').addEventListener('click', event => {
    event.stopPropagation();
  });
});
