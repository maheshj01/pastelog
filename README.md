# Pastelog

PasteLog is a simple, fast, and powerful pastebin. It is powered by NextJs in the frontend and Cloud firestore in the backend.
It allows you to publish your logs, and access them from anywhere via a unique link.

### Features

- The logs are publicly accessible, no signIn required
- The logs can be stored upto 1 Year or auto expire after the duration
- You can import logs from pastelog or Github gist
- You can fork and publish logs
- Store logs locally for easy access
- Supports rich content with basic github falvoured markdown (does not support inline HTML tags)
- Supports Darkmode

<img width="1176" alt="Screenshot 2024-06-06 at 22 14 06" src="https://github.com/firebase/firebase-js-sdk/assets/31410839/7c252c51-b81b-4bde-9ff1-29803f975b57">

### How it works

1. Visit [https://pastelog.netlify.app](https://pastelog.netlify.app)

2. Lets say you want to share some logs on a Linux machine to mac.

3. Paste your logs and choose the expire duration and submit (Linux)

Tip: you can also import gist from github by just pasting the link to your gist

4. Share the pastelog link (publicly accessible)

https://user-images.githubusercontent.com/31410839/178278070-47329147-acc4-4be2-9b6a-31dc6838629b.mp4

4. Acesss your logs via the link on your target device (MacOs)

### Adds Markdown Support

<img width="824" alt="Screenshot 2024-02-05 at 18 00 47" src="https://github.com/flutter/flutter/assets/31410839/63896d48-867f-477e-8f91-68ff40413147">

Sample markdown Pastelog: http://localhost:58889/logs/2dce19c0-c47a-11ee-ac5d-9b3943655dfd
