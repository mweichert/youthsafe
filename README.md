# YouthSafe

A Chrome browser extension which uses OpenAI's GPT 3 model to require a password to watch a YouTube video if its inappropriate for my 11 year old son.

This is mostly an experiment to get experience using OpenAI's GPT models.

## Build Instructions

```
npm install
npm run build
```

## Gotchas

- This extension will trigger a request to the GPT-3 model for every video visited. That's probably a bit much.
- I'm not sure if you use YouTube's interface to navigate from one video to another if the extension's logic will be triggered.
