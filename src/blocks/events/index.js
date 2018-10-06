import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/events.json')
    .then(response => response.json())
    .then(json => {
      const eventsNode = document.querySelector('.events');
      json.events.forEach(event => {
        const eventTemplate = eventsNode.querySelector('#event').content.cloneNode(true);
        eventTemplate.querySelector('.event__icon').classList.add(`event__icon--${event.icon}`);
        if (event.type === 'critical') {
          eventTemplate.querySelector('.event__info').classList.add('event__info--critical');
          eventTemplate.querySelector('.event__icon').classList.add(`event__icon--${event.icon}--white`);
        }
        eventTemplate.querySelector('.event__title').textContent = event.title;
        eventTemplate.querySelector('.event__name').textContent = event.source;
        eventTemplate.querySelector('.event__date').textContent = event.time;

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
              eventMediaTemplate.querySelector('.media__artist').textContent = `${event.data.artist} ${
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

          eventDataTemplate.querySelector('.event__description').textContent = event.description;
          eventTemplate.querySelector('.event').appendChild(eventDataTemplate);
        }

        eventsNode.appendChild(eventTemplate);
      });
    });
});