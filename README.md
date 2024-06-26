# Pastelog

Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.

<img width="764" alt="cover" src="https://github.com/maheshmnj/pastelog/assets/31410839/e75cfac7-93f8-4734-a0cc-d95872522230">

### Features

- The logs are publicly accessible, no signIn required
- The logs auto expire and can be stored upto 1 year
- Store logs locally for easy access
- Supports rich text content with github falvoured markdown and code highlighting
- Supports Darkmode and Lightmode
- Export logs as image and plain text

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
NEXT_PUBLIC_FIREBASE_FEATURE_COLLECTION=
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
│ │ │ ├── \_models/
│ │ │ │ ├── Log.ts
│ │ │ ├── \_services/
│ │ │ │ ├── LogService.ts
│ │ │ ├── \_components/
│ │ │ │ ├── Sidebar.tsx
│ │ │ │ ├── Navbar.tsx
│ │ │ │ ├── MainContent.tsx
│ │ │ │ │
│ │ │ ├── logs /
│ │ │ │ ├──[id]
│ │ │ │ │ └── page.tsx
│ │ │ │ └── layout.tsx
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

### Demo

<video src='https://github.com/maheshmnj/pastelog/assets/31410839/c4e4469b-3acb-45e1-a258-0d8593d1e831' width=180/>
