import './style.scss';
import Video from '../../modules/video';

document.addEventListener('DOMContentLoaded', () => {
  async function initVideo(videoContainerNode, src) {
    const video = new Video(videoContainerNode);
    video.init(src);
  }

  fetch('api/videos.json')
    .then(response => response.json())
    .then(json => {
      const videosNode = document.querySelector('.videos');
      json.videos.forEach(video => {
        const videoTemplateNode = document.querySelector('#video').content.cloneNode(true);
        const videoContainerNode = videoTemplateNode.querySelector('.video');
        videosNode.appendChild(videoTemplateNode);
        initVideo(videoContainerNode, video.src);
      });
    });
});
