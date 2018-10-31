import DomHeleper from '../../helpers/DomHelper';
import IEventData from '../../interfaces/IEventData';
import ITouch from '../../interfaces/ITouch';
import Touch from '../../modules/Touch';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://smarthouse-server.herokuapp.com/api/events/', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      const eventsNode = document.querySelector('.events');

      if (!eventsNode) {
        return;
      }

      json.events.forEach((event: IEventData) => {
        const eventTemplateNode: HTMLTemplateElement | null = document.querySelector('#event');
        const eventTemplate: DocumentFragment | null = eventTemplateNode ? DomHeleper.cloneNode(eventTemplateNode.content) : null;

        if (!eventTemplate) {
          return;
        }

        const eventNodeCont = eventTemplate.querySelector('.events__event');
        if (eventNodeCont) {
          eventNodeCont.classList.add(`events__event--${event.size}`);
        }
        const eventIcon = eventTemplate.querySelector('.events__icon');
        if (eventIcon) {
          eventIcon.classList.add(`event__icon--${event.icon}`);
          eventIcon.classList.add(`event__icon--${event.size}`);
        }
        if (event.type === 'critical') {
          const eventInfo = eventTemplate.querySelector('.event__info');
          if (eventInfo) {
            eventInfo.classList.add('event__info--critical');
          }
          if (eventIcon) {
            eventIcon.classList.add(`event__icon--${event.icon}--white`);
          }
        }
        const eventTitle = eventTemplate.querySelector('.event__title');
        if (eventTitle) {

          eventTitle.textContent = event.title;
          eventTitle.classList.add(`event__title--${event.size}`);
        }
        const eventName = eventTemplate.querySelector('.event__name');
        if (eventName) {

          eventName.textContent = event.source;
          eventName.classList.add(`event__name--${event.size}`);
        }
        const eventDate = eventTemplate.querySelector('.event__date');
        if (eventDate) {

          eventDate.textContent = event.time;
          eventDate.classList.add(`event__date--${event.size}`);
        }

        if (event.description || event.data) {
          const eventDataNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventData');
          const eventDataTemplate: DocumentFragment | null = eventDataNode ? DomHeleper.cloneNode(eventDataNode.content) : null;
          const dataNode: HTMLElement | null = eventDataTemplate ? eventDataTemplate.querySelector('.event__data') : null;
          const eventGraphNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventGraph');
          const eventGraphTemplate: DocumentFragment | null = eventGraphNode ? DomHeleper.cloneNode(eventGraphNode.content) : null;
          const eventMicroclimateNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventMicroclimate');
          const eventMicroclimateTemplate: DocumentFragment | null = eventMicroclimateNode ? DomHeleper.cloneNode(eventMicroclimateNode.content) : null;
          const eventMediaNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventMedia');
          const eventMediaTemplate: DocumentFragment | null = eventMediaNode ? DomHeleper.cloneNode(eventMediaNode.content) : null;
          const eventButtonsNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventButtons');
          const eventButtonsTemplate: DocumentFragment | null = eventButtonsNode ? DomHeleper.cloneNode(eventButtonsNode.content) : null;
          const eventWalleNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventWalle');
          const eventWalleTemplate: DocumentFragment | null = eventWalleNode ? DomHeleper.cloneNode(eventWalleNode.content) : null;

          if (event.data) {
            if (event.data.type && eventDataTemplate && eventGraphTemplate) {
              const eventData = eventDataTemplate.querySelector('.event__data');
              if (eventData) {
                eventData.appendChild(eventGraphTemplate);
              }
            }
            if (event.data.temperature && eventMicroclimateTemplate && eventMicroclimateTemplate) {
              const microclimate: HTMLElement | null = eventMicroclimateTemplate.querySelector('.microclimate__value--temperature');
              const humidity: HTMLElement | null = eventMicroclimateTemplate.querySelector('.microclimate__value--humidity');
              if (microclimate) {
                microclimate.textContent = String(event.data.temperature);
              }
              if (humidity) {

                humidity.textContent = String(event.data.humidity);
              }
              if (dataNode) {
                dataNode.appendChild(eventMicroclimateTemplate);
              }
            }
            if (event.data.track && eventMediaTemplate && eventMediaTemplate) {
              const albumcover: HTMLImageElement | null = eventMediaTemplate.querySelector('.media__albumcover');
              const artist: HTMLElement | null = eventMediaTemplate.querySelector('.media__artist');
              const time: HTMLElement | null = eventMediaTemplate.querySelector('.media__time-value');
              const volume: HTMLElement | null = eventMediaTemplate.querySelector('.media__volume-value');
              if (albumcover) {
                albumcover.src = String(event.data.albumcover);
              }
              if (artist) {
                artist.textContent = `${event.data.artist} - ${event.data.track.name}`;
              }
              if (time) {
                time.textContent = event.data.track.length;
              }
              if (volume) {
                volume.textContent = String(event.data.volume);
              }
              if (dataNode) {
                dataNode.appendChild(eventMediaTemplate);
              }
            }
            if (event.data.buttons && eventButtonsTemplate) {
              const b1 = eventButtonsTemplate.querySelector('.button--col1');
              const b2 = eventButtonsTemplate.querySelector('.button--col2');
              if (b1) {
                b1.textContent = event.data.buttons[0];
              }
              if (b2) {
                b2.textContent = event.data.buttons[1];
              }
              if (dataNode) {
                dataNode.appendChild(eventButtonsTemplate);
              }
            }
            if (event.data.image && eventWalleTemplate) {
              if (dataNode) {
                dataNode.appendChild(eventWalleTemplate);
              }
            }
          }

          const description: HTMLElement | null = eventDataTemplate ? eventDataTemplate.querySelector('.event__description') : null;
          if (description) {
            description.classList.add(`event__description--${event.size}`);
            description.textContent = event.description;
          }
          const eventNode = eventTemplate.querySelector('.event');
          if (eventNode && eventDataTemplate) {
            eventNode.appendChild(eventDataTemplate);
          }
        } else {
          const eventControlsNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventControls');
          const eventControlsTemplate: DocumentFragment | null = eventControlsNode ? DomHeleper.cloneNode(eventControlsNode.content) : null;
          if (eventControlsTemplate) {
            const eventNode = eventControlsTemplate.querySelector('.event');
            if (eventNode) {
              eventNode.appendChild(eventControlsTemplate);
              eventNode.classList.add('event--control');
            }
          }
        }

        eventsNode.appendChild(eventTemplate);
      });
    })
    .then(() => {
      const imgNode: HTMLImageElement | null = document.querySelector('.walle__img');
      const zoomNode: HTMLInputElement | null = document.querySelector('.walle__range--zoom');
      const brightnessNode: HTMLInputElement | null = document.querySelector('.walle__range--brightness');
      if (imgNode && zoomNode && brightnessNode) {
        const touch: ITouch = new Touch(imgNode, zoomNode, brightnessNode);
        touch.init();
      }
    })
    .then(() => {
      const events = document.querySelectorAll('.event');
      for (let i = 0; i < events.length; i += 1) {
        events[i].addEventListener('mouseover', function (this: HTMLElement, event: Event) {
          event.stopPropagation();
          const eventNode: HTMLElement | null = this.querySelector('.event__controls');
          if (eventNode) {
            eventNode.style.visibility = 'visible';
          }
        });
        events[i].addEventListener('mouseout', function (this: HTMLElement, event: Event) {
          event.stopPropagation();
          const eventNode: HTMLElement | null = this.querySelector('.event__controls');
          if (eventNode) {
            eventNode.style.visibility = 'hidden';
          }
        });
      }
    });
});
