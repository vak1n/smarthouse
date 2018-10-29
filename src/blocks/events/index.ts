import './style.scss';
import IEventData from '../../interfaces/IEventData';
import ITouch from '../../interfaces/ITouch';
import Touch from '../../modules/touch';

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
        const eventTemplate: HTMLElement | null = eventTemplateNode ? <HTMLElement> eventTemplateNode.content.cloneNode(true) : null;

        if (!eventTemplate) {
          return;
        }

        const eventNodeCont = eventTemplate.querySelector('.events__event');
        eventNodeCont && eventNodeCont.classList.add(`events__event--${event.size}`);
        const eventIcon = eventTemplate.querySelector('.events__icon');
        if (eventIcon) {
          eventIcon.classList.add(`event__icon--${event.icon}`);
          eventIcon.classList.add(`event__icon--${event.size}`);
        }
        if (event.type === 'critical') {
          const eventInfo = eventTemplate.querySelector('.event__info');
          eventInfo && eventInfo.classList.add('event__info--critical');
          eventIcon && eventIcon.classList.add(`event__icon--${event.icon}--white`);
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
          const eventDataTemplate: HTMLElement | null = eventDataNode ? <HTMLElement>eventDataNode.content.cloneNode(true) : null;
          const dataNode: HTMLElement | null = eventDataTemplate ? eventDataTemplate.querySelector('.event__data') : null;
          const eventGraphNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventGraph');
          const eventGraphTemplate: HTMLElement | null = eventGraphNode ? <HTMLElement>eventGraphNode.content.cloneNode(true) : null;
          const eventMicroclimateNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventMicroclimate');
          const eventMicroclimateTemplate: HTMLElement | null = eventMicroclimateNode ? <HTMLElement>eventMicroclimateNode.content.cloneNode(true) : null;
          const eventMediaNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventMedia');
          const eventMediaTemplate: HTMLElement | null = eventMediaNode ? <HTMLElement>eventMediaNode.content.cloneNode(true) : null;
          const eventButtonsNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventButtons');
          const eventButtonsTemplate: HTMLElement | null = eventButtonsNode ? <HTMLElement>eventButtonsNode.content.cloneNode(true) : null;
          const eventWalleNode: HTMLTemplateElement | null = eventsNode.querySelector('#eventWalle');
          const eventWalleTemplate: HTMLElement | null = eventWalleNode ? <HTMLElement>eventWalleNode.content.cloneNode(true) : null;

          if (event.data) {
            if (event.data.type && eventDataTemplate && eventGraphTemplate) {
              const eventData = eventDataTemplate.querySelector('.event__data');
              eventData && eventData.appendChild(eventGraphTemplate);
            }
            if (event.data.temperature && eventMicroclimateTemplate && eventMicroclimateTemplate) {
              const microclimate: HTMLElement | null = eventMicroclimateTemplate.querySelector('.microclimate__value--temperature');
              const humidity: HTMLElement | null = eventMicroclimateTemplate.querySelector('.microclimate__value--humidity');
              microclimate && (microclimate.textContent = String(event.data.temperature));
              humidity && (humidity.textContent = String(event.data.humidity));
              dataNode && dataNode.appendChild(eventMicroclimateTemplate);
            }
            if (event.data.track && eventMediaTemplate && eventMediaTemplate) {
              const albumcover: HTMLImageElement | null = eventMediaTemplate.querySelector('.media__albumcover');
              const artist: HTMLElement | null = eventMediaTemplate.querySelector('.media__artist');
              const time: HTMLElement | null = eventMediaTemplate.querySelector('.media__time-value');
              const volume: HTMLElement | null = eventMediaTemplate.querySelector('.media__volume-value');
              albumcover && (albumcover.src = String(event.data.albumcover));
              artist && (artist.textContent = `${event.data.artist} - ${event.data.track.name}`);
              time && (time.textContent = event.data.track.length);
              volume && (volume.textContent = String(event.data.volume));
              dataNode && dataNode.appendChild(eventMediaTemplate);
            }
            if (event.data.buttons && eventButtonsTemplate) {
              const b1 = eventButtonsTemplate.querySelector('.button--col1');
              const b2 = eventButtonsTemplate.querySelector('.button--col2');
              b1 && (b1.textContent = event.data.buttons[0]);
              b2 && (b2.textContent = event.data.buttons[1]);
              dataNode && dataNode.appendChild(eventButtonsTemplate);
            }
            if (event.data.image && eventWalleTemplate) {
              dataNode && dataNode.appendChild(eventWalleTemplate);
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
          const eventControlsTemplate: HTMLElement | null = eventControlsNode ? <HTMLElement>eventControlsNode.content.cloneNode(true) : null;
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
      const imgNode: HTMLImageElement | null = <HTMLImageElement>document.querySelector('.walle__img');
      const zoomNode: HTMLInputElement | null = <HTMLInputElement>document.querySelector('.walle__range--zoom');
      const brightnessNode: HTMLInputElement | null = <HTMLInputElement>document.querySelector('.walle__range--brightness');
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
          const eventNode: HTMLElement = <HTMLElement>this.querySelector('.event__controls');
          eventNode && (eventNode.style.visibility = 'visible');
        });
        events[i].addEventListener('mouseout', function (this: HTMLElement, event: Event) {
          event.stopPropagation();
          const eventNode: HTMLElement = <HTMLElement>this.querySelector('.event__controls');
          eventNode && (eventNode.style.visibility = 'hidden');
        });
      }
    });
});
