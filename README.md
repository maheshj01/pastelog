![Banner (1)](https://github.com/maheshmnj/pastelog/assets/31410839/34127d75-f01d-47df-a223-033f1ed5379a)

# Pastelog

Create Stunning AI Powered Rich notes with markdown Support and Code Highlighting and share it with a unique URL. The logs are publicly accessible and auto expire after the specified date. Powered By Next.js, Firebase and Gemini API.

<a href="https://www.producthunt.com/posts/pastelog?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pastelog" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=466669&theme=light" alt="Pastelog - Create&#0032;stunning&#0032;rich&#0032;text&#0032;notes&#0032;in&#0032;minutes | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

<img width="764" alt="Screenshot 2025-04-07 at 14 15 41" src="https://github.com/user-attachments/assets/4f8ffdc8-5d7f-4158-8aee-1f7293ed6616" />


### Features


- The logs are publicly accessible, no SignIn required
- The logs auto expire after the specified date
- Stores logs locally for quick access
- Supports rich text content with github falvoured markdown and code highlighting
- Export logs as image and plain text
- Import logs from Github gist or from Pastelog Url
- Intelligent editor with Markdown Keyboard shortcuts support to help you write faster
- Supports Darkmode for better readability
- Share logs with a unique URL
- Summarize logs using the Google Gemini API (Uses Ephemeral API key storage)

### Building the project

1. Clone the repository

```bash
git clone
```

2. Install the dependencies

```bash

npm install
```

3. Add the .env in the root with the following keys

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_COLLECTION=
NEXT_PUBLIC_FIREBASE_CONFIG_COLLECTION=
NEXT_PUBLIC_FIREBASE_FEATURE_BANNER=
NEXT_PUBLIC_NEW_USER_VISITED=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_GITHUB_REPO=https://github.com/maheshmnj/pastelog
NEXT_PUBLIC_PRIVACY_POLICY=/logs/publish/1R5Kx9fQRBHe85SUOG89
NEXT_PUBLIC_BASE_URL=https://pastelog.vercel.app
NEXT_PUBLIC_GITHUB_LOGO=https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png
NEXT_PUBLIC_GITHUB_GIST_API=https://api.github.com/gists
```

3. Run the project

```bash
npm run dev
```

### Folder Structure

<!-- current folder structure -->

```
root /
├──src
│ ├── app /
│ │ ├── (main)/
│ │ │ │ ├── Log.ts
│ │ │ ├── \_services/
│ │ │ │ ├── LogService.ts
│ │ │ ├── \_components/
│ │ │ ├ ├──├── \_Dialog/
│ │ │ ├ |────   └── SearchDialog.tsx
│ │ │ │ ├── Sidebar.tsx
│ │ │ │ ├── Navbar.tsx
│ │ │ │ ├── MainContent.tsx
│ │ │ │ │
│ │ │ ├── logs /
│ │ │ │ ├──[id]
│ │ │ │ │ └── page.tsx
│ │ │ │ └── layout.tsx
│ │ │ │ └── app_layout.tsx
│ │ │ │ └── page.tsx
│ │ ├── (publish)/
│ │ │ ├── logs /
│ │ │ │ ├── publish /
│ │ │ │ │ ├──[id]/
│ │ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ └── layout.tsx
│ │ └── global.css
│ │ └── page.tsx
```

### Summarize Logs with Gemini

<video src='https://github.com/maheshmnj/pastelog/assets/31410839/0eecf88c-a198-43ff-958a-47fb192fae73' width=180/>

### Demo

<video src='https://github.com/maheshmnj/pastelog/assets/31410839/c4e4469b-3acb-45e1-a258-0d8593d1e831' width=180/>
