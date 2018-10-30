import DomHeleper from '../../helepers/DomHeleper';
import IVideoData from '../../interfaces/IVideoData';
import Video from '../../modules/Video';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  async function initVideo(videoContainerNode: HTMLElement, src: string) {
    const video = new Video(videoContainerNode);
    video.init(src);
  }

  fetch('api/videos.json')
    .then(response => response.json())
    .then(json => {
      const videosNode = document.querySelector('.videos');
      if (!videosNode) {
        return
      }
      json.videos.forEach((video: IVideoData) => {
        const videoTemplate: HTMLTemplateElement | null = document.querySelector('#video');
        const videoTemplateNode: DocumentFragment | null = videoTemplate ? DomHeleper.cloneNode(videoTemplate.content) : null;
        if (!videoTemplateNode) {
          return
        }
        const videoContainerNode: HTMLElement | null = videoTemplateNode.querySelector('.video');
        videosNode.appendChild(videoTemplateNode);
        if (videoContainerNode) {
          initVideo(videoContainerNode, video.src);
        }
      });
    });
});
