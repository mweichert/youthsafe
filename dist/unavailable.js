/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/unavailable.js ***!
  \****************************/
document.getElementById('password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPassword = document.getElementById('password').value;
  
    const storedPassword = (await chrome.storage.local.get('password')).password || 'secret';
    if (enteredPassword !== storedPassword) {
      alert('Incorrect password');
      return;
    }
  
    const videoUrl = document.referrer;
    const allowedVideos = (await chrome.storage.local.get('allowed_videos')).allowed_videos || [];
  
    allowedVideos.push(videoUrl);
    await chrome.storage.local.set({ allowed_videos: allowedVideos });
  
    window.location.href = videoUrl;
  });
  
/******/ })()
;
//# sourceMappingURL=unavailable.js.map