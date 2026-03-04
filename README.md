# AnonDev

> Anonymous developer discussion boards — no accounts, no profiles, just ideas and code.

**[Live Demo →](https://anondev-steel.vercel.app/)**

---

## Overview

AnonDev is an anonymous discussion platform built for developers.

It strips away identity, resumes, and follower counts from the conversation. The goal is a space where developers can freely ask questions, share ideas, and discuss code without social pressure.

```
Anon#37dc20  →  just ideas and code
```

---

## Why AnonDev

Developers often hesitate to ask "basic" questions because identity creates pressure.

- Experience levels become visible
- Questions feel judged
- Discussions become performative

AnonDev removes that layer. Users interact anonymously while still maintaining a **consistent identity within each thread** — so conversations stay coherent without exposing who you are.

---

## Features

- 🕵️ Fully anonymous developer discussion boards
- 🧵 Per-thread anonymous identities (consistent within a thread, private across threads)
- 📝 Markdown support with syntax-highlighted code blocks
- 👍 Post reactions
- 📄 Thread pagination (50 posts per page)
- ⚡ Server-rendered pages
- 🌙 Dark / light theme
- 🔓 No authentication required

---

## Screenshots


<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/29909cde-2bfa-4a7d-8d15-b8841ea65432" />
<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/e625738b-5619-47d2-a22f-675f37444e4a" />
<img width="1919" height="920" alt="image" src="https://github.com/user-attachments/assets/5eb05b7b-fb47-4109-ae21-de467f573656" />



---

## Tech Stack

### Frontend
- [Next.js 16](https://nextjs.org/) (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- [MongoDB](https://www.mongodb.com/)
- Mongoose

### Deployment
- [Vercel](https://vercel.com/) Serverless Functions

---

## Architecture

Designed for read-heavy discussion workloads.

### Data Flow

```
User Request
      ↓
Next.js Server Component
      ↓
API Route
      ↓
MongoDB Query
      ↓
Posts + reactions returned
```

### Database Collections

```
boards
threads
posts
reactions
```

Indexes support:
- Board slug lookup
- Thread pagination
- Reaction aggregation

---

## Performance

Measured in production on Vercel:

| Metric | Value |
|---|---|
| Average thread response time | ~240–260 ms |
| Posts per paginated request | 50 |
| Reaction queries | Batched (no N+1) |

---

## Key Implementation Details

### Anonymous Identity System

User identity is generated using:

```
hash(IP + threadId + salt)
```

This allows:
- Consistent identity inside a thread
- Full anonymity across threads
- No authentication system needed

### Pagination

```
50 posts per request
```

Keeps queries efficient and scalable as threads grow.

### Reaction System

Reactions are fetched in a **single batched query** instead of per-post queries, preventing N+1 database issues.

---

## Running Locally

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/anondev.git
cd anondev
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `.env.local`**

```env
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_BASE_URL=http://localhost:3000
IP_SALT=random_string
CRON_SECRET=random_string
```

**4. Start the dev server**

```bash
npm run dev
```

**5. Open** `http://localhost:3000`

---

## Deployment

This project is deployed on Vercel.

1. Push repository to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Configure environment variables (same as `.env.local`)
4. Deploy

---

## Future Improvements

- [ ] Rate limiting & spam protection
- [ ] Board moderation tools
- [ ] Search across threads
- [ ] WebSocket live updates
- [ ] Trending boards

---

## Motivation

AnonDev started as an experiment in building an anonymous developer community, while exploring:

- Server-rendered full-stack applications
- Scalable discussion systems
- Modern Next.js architecture

The first working version was built in **~24 hours**.

---

## License

[MIT](LICENSE)
