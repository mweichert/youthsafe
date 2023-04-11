const promptText = (title, desc, transcript) => `
Return true or false if the video is deemed to be appropriate for an 11 year old. Blood and gore is ok. Use your descretion for anything else. You will receive a prompt with the video title, description, and transcript. You can use this information to determine if the video is appropriate. If you are unsure, return false. If you are sure, return true.

Example Video:
- Title: MARRIED People CAUGHT CHEATING, What Happens Is Shocking | Illumeably
- Description:
- Transcript: Couple discusses plans while on a date. The man suggests spending time with a friend going through a breakup. They leave and talk about their relationships.

Couple discusses relationship issues and plans to spend time together : The wife's co-worker is going through a breakup and needs her support.
The husband suggests the wife spend time with her friend while he meditates.
The husband meets with someone else while the wife goes on a date with her friend.
The husband and wife discuss problems with their current partners and express desire to be together.
They plan to spend time together and come up with excuses to avoid their partners.

Couple plans to spend a day together : The woman tries to find a way to spend the day with her partner
She plans a girl's day with her friend to keep her occupied

Ryan is out, giving us time alone : We have been waiting for this moment
We celebrated our freedom with gifts and toasts

Cheating leads to unexpected honesty between couples : Lisa and her friend plan to cheat on their partners, but end up having an honest conversation about their failing marriages
Ryan catches Lisa in the act, but the situation prompts them to have a sincere discussion about their issues

Four people discover they've been cheating with each other's partners : Emilia and Jackson are married and were cheating on their respective partners Lisa and Ryan with each other
The four decide to work on their marriages instead of getting a divorce or swapping partners

Infidelity discovered, couples work it out but Ryan's paternity is in question. : Jackson and Amelia have a hard time getting along after infidelity is discovered.
While the couples put the cheating in past, Ryan's unexpected phone call puts his paternity in question.

A couple discusses having children, leading to a revelation about the pregnancy : Ryan and his wife talk about having children, with the wife stating she doesn't want any, but that can change in the future
A different couple, Jackson and Lisa, discuss a pregnancy, which turns out not to be Jackson's, leading to a conversation about honesty and breaking a negative cycle

Two couples confront each other about infidelity and decide to divorce : Amelia is pregnant with Ryan's baby and they decide to raise it together
Lisa and Jackson admit to seeing each other and their marriage ends

Example Response:
false

Actual Video:
- Title: ${title}
- Description: ${desc}
- Transcript: ${transcript}

Return either true or false.
`;

// Get the YouTube Title, Description, and Transcript
async function getVideoDetails(videoUrl, youtubeApiKey) {
  const videoId = videoUrl.split('watch?v=')[1];
  const YouTube = require("youtube-sr").default;

  const video = await YouTube.getVideo(videoUrl, { part: 'snippet' })
  
  const query = {
    videoId: videoId
  };
  debugger
  const fetchUrl = "https://youtube-browser-api.netlify.app/transcript?" + new URLSearchParams(query).toString()

  let transcript = "";
  try {
    const transcriptRes = await fetch(fetchUrl).then(res => res.json())
    transcript = transcriptRes.videoId.map(part => part.text).join("\n")
  }
  catch {
    // Nothing needs to be done here
  }
  
  const {title, description} = video;

  return {title, description, transcript};
}


async function isAppropriate(url) {
  const {youtube_api_key, openai_key} = await chrome.storage.local.get(['youtube_api_key', 'openai_key'])

  // Get video title and description
  const {title, description, transcript} = await getVideoDetails(url.toString(), youtube_api_key);

  // Prepare the prompt for ChatGPT
  const prompt = promptText(title, description, transcript);

  // Call ChatGPT and return the result
  if (openai_key) {
    const chatGPTResult = await promptChatGPT(prompt, openai_key);
    return chatGPTResult;
  } else {
    alert('Please set your OpenAI API key in the extension options.');
    return false;
  }
}

async function promptChatGPT(promptText, apiKey) {
  require('buffer');
  require('stream-http');
  require('https-browserify');
  require('url');

  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({apiKey});
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promptText,
  });

  const answer = completion.data.choices[0].text.trim().toLowerCase();
  return answer === 'true';
}

async function checkVideo() {
    const { openai_key, youtube_api_key } = await chrome.storage.local.get(['openai_key', 'youtube_api_key']);
    const videoUrl = window.location.href;
  
    if (!openai_key || !youtube_api_key) return;
  
    const appropriate = await isAppropriate(videoUrl);
    if (!appropriate) {
      const allowedVideos = (await chrome.storage.local.get('allowed_videos')).allowed_videos || [];
  
      if (!allowedVideos.includes(videoUrl)) {
        window.location.href = chrome.runtime.getURL('unavailable.html');
      }
    }
  }
  
  checkVideo();

  // If the url changes, check the video again
  window.addEventListener('yt-navigate-finish', checkVideo);