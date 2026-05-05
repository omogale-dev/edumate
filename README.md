# EduMate

> **Your personal AI teacher. From Class 5 to PhD.**
> India's most premium AI tutor — built with Next.js 14, TypeScript, Tailwind, and Three.js.

A premium dark-themed AI tutoring app inspired by linear.app, vercel.com, and openai.com. Features a 3D glowing orb (Three.js + react-three-fiber + bloom post-processing) that reacts to voice and AI activity, ChatGPT-style layout, voice in/out via Web Speech API, conversation history, and a typewriter streaming effect for AI responses.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom dark theme (electric blue accent)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` (`MeshDistortMaterial`)
- **@react-three/postprocessing** for soft bloom
- **Framer Motion** for UI animation
- **Geist** font from Vercel
- **Lucide React** for icons
- **Web Speech API** (browser native) for voice input + output
- **localStorage** for user identity + conversation history

---

## File structure

```
edumate/
├── app/
│   ├── chat/
│   │   └── page.tsx              # Main chat interface
│   ├── globals.css               # Tailwind + design tokens
│   ├── layout.tsx                # Root layout + Geist fonts
│   └── page.tsx                  # Landing page
├── components/
│   ├── chat/
│   │   ├── ChatHeader.tsx        # Mode toggle + XP badge
│   │   ├── EmptyState.tsx        # Hero orb + prompt suggestions
│   │   ├── InputBar.tsx          # Text + mic + send
│   │   ├── MessageBubble.tsx     # Chat bubble with copy/speak
│   │   ├── Sidebar.tsx           # Conversation history
│   │   └── TypingIndicator.tsx   # Three-dot loader
│   ├── three/
│   │   ├── Orb.tsx               # The 3D orb (R3F)
│   │   └── OrbClient.tsx         # SSR-safe wrapper
│   └── ui/
│       ├── Logo.tsx              # EduMate logo
│       └── NameModal.tsx         # First-visit name prompt
├── lib/
│   ├── api.ts                    # n8n webhook client
│   ├── speech.ts                 # Web Speech API hooks
│   ├── storage.ts                # localStorage helpers
│   └── types.ts                  # TS types
├── public/                       # static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── README.md
```

---

## Run locally

**Requirements:** Node.js 18.17+ (Node 20 LTS recommended), npm 9+.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

That's it. There are **no environment variables** required — the n8n webhook URL is hard-coded as requested.

> **Note about voice features:** the Web Speech API requires Chrome, Edge, or Safari. Firefox does not currently support `SpeechRecognition`. The mic button auto-hides when the API is unavailable. Voice input also requires the page to be served over **HTTPS** in production (localhost is exempt).

---

## Build for production

```bash
npm run build
npm run start
```

---

## Deploy to Vercel

The fastest path:

```bash
# Once, globally
npm i -g vercel

# From the project root
vercel
```

Or via the dashboard:

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — keep all defaults.
4. Click **Deploy**. Done in ~60 seconds.

No environment variables are required. The deployed URL will be `https://<your-project>.vercel.app`.

---

## How it works

### Onboarding
On first visit, a clean modal asks for the user's name. A random 10-digit `phone`-like ID is generated and stored in `localStorage` along with the name. This ID is used as the stable user identifier for all webhook calls.

### Chat flow
1. User sends a message (typed or spoken).
2. The message is appended to the active conversation, which is persisted to `localStorage`.
3. A `POST` request is sent to `https://omdeveloper.app.n8n.cloud/webhook/study` with `{ phone, name, question }`.
4. While waiting, a typing indicator with a small thinking-state orb is shown.
5. When the response arrives, the `answer` is streamed character-by-character into the assistant bubble (typewriter effect, ~14ms per char, faster for long answers).
6. If the response includes an `xp` field, the XP badge in the header updates with a spring animation and the new XP is persisted.

### The orb states

| State       | When                                         | Visual                              |
| ----------- | -------------------------------------------- | ----------------------------------- |
| `idle`      | Default — no chat activity                   | Soft breathing pulse, low distortion |
| `listening` | User is recording voice input                | Faster pulse, more distortion       |
| `thinking`  | API call is in flight                        | Wavy distortion, rapid speed        |
| `speaking`  | AI response is being streamed or read aloud  | Fast pulse, high amplitude          |

### Mode toggle
The Study/Exam toggle is currently visual only — both modes call the same webhook. The selected mode is preserved in component state. To wire it through, extend the request body in `lib/api.ts` to include `mode`.

---

## Customization

- **Accent color:** edit `tailwind.config.ts` → `colors.accent`. Also update the orb material colors in `components/three/Orb.tsx`.
- **Webhook URL:** edit `WEBHOOK_URL` in `lib/api.ts`.
- **Suggestions on empty state:** edit `SUGGESTIONS` in `components/chat/EmptyState.tsx`.
- **Voice language:** change `lang` in `lib/speech.ts` (currently `en-IN`).
- **Typewriter speed:** edit `baseDelay` in `streamIntoMessage` inside `app/chat/page.tsx`.

---

## Browser support

- **Chrome / Edge / Brave (desktop + Android):** Full support including voice
- **Safari (macOS + iOS):** Full support including voice
- **Firefox:** Everything except voice input (mic button auto-hides)

---

## Known notes

- All state is local — clearing browser storage resets everything (including XP).
- The webhook is called directly from the browser (no Next.js API route proxy). If you ever switch to a webhook that requires a secret, move the call into `app/api/study/route.ts` and read the secret from `process.env`.
- The orb uses `dpr` capped at 2 to keep mobile performance smooth.

---

Made with care for India's curious minds.
