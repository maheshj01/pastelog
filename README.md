# Pastelog

Creating Stunning Rich Text Logs with markdown Support and Code Highlighting and sharing them with the world.

### Demo

<video src='https://github.com/maheshmnj/pastelog/assets/31410839/c4e4469b-3acb-45e1-a258-0d8593d1e831'/>

### Features

- The logs are publicly accessible, no signIn required
- The logs can be stored upto 1 Year or auto expire after the duration
- You can import logs from pastelog or Github gist
- You can fork and publish logs
- Store logs locally for easy access
- Supports rich content with basic github falvoured markdown (does not support inline HTML tags)
- Supports Darkmode

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
NEXT_PUBLIC_NEW_USER_VISITED=visited
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_GITHUB_REPO=https://github.com/maheshmnj/pastelog
NEXT_PUBLIC_PRIVACY_POLICY=/logs/publish/1R5Kx9fQRBHe85SUOG89
NEXT_PUBLIC_BASE_URL=https://pastelog.web.app

```

3. Run the project

```bash
npm run dev
```

<img width="1176" alt="Screenshot 2024-06-06 at 22 14 06" src="https://github.com/firebase/firebase-js-sdk/assets/31410839/7c252c51-b81b-4bde-9ff1-29803f975b57">

### Folder Structure

<!-- current folder structure -->

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
