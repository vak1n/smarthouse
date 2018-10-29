import './style.scss';
import Video from '../../modules/Video';
import IVideoData from '../../interfaces/IVideoData';

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
        const videoTemplate: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#video');
        const videoTemplateNode: HTMLElement | null = videoTemplate ? <HTMLElement>videoTemplate.content.cloneNode(true) : null;
        if (!videoTemplateNode) {
          return
        }
        const videoContainerNode: HTMLElement | null = <HTMLElement>videoTemplateNode.querySelector('.video');
        videosNode.appendChild(videoTemplateNode);
        initVideo(videoContainerNode, video.src);
      });
    });
});
