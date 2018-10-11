import './style.scss';
import Video from '../../modules/video';

document.addEventListener('DOMContentLoaded', () => {
  const videoNodes = document.querySelectorAll('.video');
  if (videoNodes !== null) {
    for (let i = 0; i < videoNodes.length; i += 1) {
      const video = new Video(videoNodes[i]);
      video.init();
    }
  }
});
