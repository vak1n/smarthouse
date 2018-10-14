import './style.scss';
import Touch from '../../modules/touch';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://smarthouse-server.herokuapp.com/api/events/', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      const eventsNode = document.querySelector('.events');
      json.events.forEach(event => {
        const eventTemplate = eventsNode.querySelector('#event').content.cloneNode(true);
        eventTemplate.querySelector('.events__event').classList.add(`events__event--${event.size}`);
        eventTemplate.querySelector('.event__icon').classList.add(`event__icon--${event.icon}`);
        eventTemplate.querySelector('.event__icon').classList.add(`event__icon--${event.size}`);
        if (event.type === 'critical') {
          eventTemplate.querySelector('.event__info').classList.add('event__info--critical');
          eventTemplate.querySelector('.event__icon').classList.add(`event__icon--${event.icon}--white`);
        }
        eventTemplate.querySelector('.event__title').textContent = event.title;
        eventTemplate.querySelector('.event__title').classList.add(`event__title--${event.size}`);
        eventTemplate.querySelector('.event__name').textContent = event.source;
        eventTemplate.querySelector('.event__name').classList.add(`event__name--${event.size}`);
        eventTemplate.querySelector('.event__date').textContent = event.time;
        eventTemplate.querySelector('.event__date').classList.add(`event__date--${event.size}`);

        if (event.description || event.data) {
          const eventDataTemplate = eventsNode.querySelector('#eventData').content.cloneNode(true);
          const eventGraphTemplate = eventsNode.querySelector('#eventGraph').content.cloneNode(true);
          const eventMicroclimateTemplate = eventsNode.querySelector('#eventMicroclimate').content.cloneNode(true);
          const eventMediaTemplate = eventsNode.querySelector('#eventMedia').content.cloneNode(true);
          const eventButtonsTemplate = eventsNode.querySelector('#eventButtons').content.cloneNode(true);
          const eventWalleTemplate = eventsNode.querySelector('#eventWalle').content.cloneNode(true);

          if (event.data) {
            if (event.data.type) {
              eventDataTemplate.querySelector('.event__data').appendChild(eventGraphTemplate);
            }
            if (event.data.temperature) {
              [
                eventMicroclimateTemplate.querySelector('.microclimate__value--temperature').textContent,
                eventMicroclimateTemplate.querySelector('.microclimate__value--humidity').textContent,
              ] = [event.data.temperature, event.data.humidity];
              eventDataTemplate.querySelector('.event__data').appendChild(eventMicroclimateTemplate);
            }
            if (event.data.track) {
              eventMediaTemplate.querySelector('.media__albumcover').src = event.data.albumcover;
              eventMediaTemplate.querySelector('.media__artist').textContent = `${event.data.artist} - ${
                event.data.track.name
              }`;
              eventMediaTemplate.querySelector('.media__time-value').textContent = event.data.track.length;
              eventMediaTemplate.querySelector('.media__volume-value').textContent = event.data.volume;
              eventDataTemplate.querySelector('.event__data').appendChild(eventMediaTemplate);
            }
            if (event.data.buttons) {
              [
                eventButtonsTemplate.querySelector('.button--col1').textContent,
                eventButtonsTemplate.querySelector('.button--col2').textContent,
              ] = [...event.data.buttons];
              eventDataTemplate.querySelector('.event__data').appendChild(eventButtonsTemplate);
            }
            if (event.data.image) {
              eventDataTemplate.querySelector('.event__data').appendChild(eventWalleTemplate);
            }
          }

          eventDataTemplate.querySelector('.event__description').classList.add(`event__description--${event.size}`);
          eventDataTemplate.querySelector('.event__description').textContent = event.description;
          eventTemplate.querySelector('.event').appendChild(eventDataTemplate);
        } else {
          const eventControlsTemplate = eventsNode.querySelector('#eventControls').content.cloneNode(true);
          eventTemplate.querySelector('.event').appendChild(eventControlsTemplate);
          eventTemplate.querySelector('.event').classList.add('event--control');
        }

        eventsNode.appendChild(eventTemplate);
      });
    })
    .then(() => {
      if ('ontouchstart' in document.documentElement) {
        const imgNode = document.querySelector('.walle__img');
        const zoomNode = document.querySelector('.walle__value--zoom');
        const brightnessNode = document.querySelector('.walle__value--brightness');
        const touch = new Touch(imgNode, zoomNode, brightnessNode);
      }
    })
    .then(() => {
      const events = document.querySelectorAll('.event');
      for (let i = 0; i < events.length; i += 1) {
        events[i].addEventListener('mouseover', function (event) {
          event.stopPropagation();
          const eventNode = this.querySelector('.event__controls');
          if (eventNode !== null) {
            eventNode.style.visibility = 'visible';
          }
        });
        events[i].addEventListener('mouseout', function (event) {
          event.stopPropagation();
          const eventNode = this.querySelector('.event__controls');
          if (eventNode !== null) {
            eventNode.style.visibility = 'hidden';
          }
        });
      }
    });
});
