document.getElementById('options-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const openaiKey = document.getElementById('openai-key').value;
  const youtubeApiKey = document.getElementById('youtube-api-key').value;

  const storedPassword = (await chrome.storage.local.get('password')).password || 'secret';
  if (currentPassword !== storedPassword) {
    alert('Incorrect password');
    return;
  }

  await chrome.storage.local.set({
    password: newPassword || storedPassword,
    openai_key: openaiKey,
    youtube_api_key: youtubeApiKey
  });

  alert('Settings saved');
});
