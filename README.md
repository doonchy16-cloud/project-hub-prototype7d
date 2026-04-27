# Prototype 7D

Prototype 7D starts from the latest welcome-page-based Prototype 7 and adds a MongoDB Atlas backend skeleton that is ready for real persistence.

## What Prototype 7D adds

- MongoDB Atlas connection helper with clear failure when env vars are missing
- Placeholder environment setup for local and Vercel deployment
- Backend-ready collections for:
  - users
  - profiles
  - projects
  - project memberships
  - conversations
  - conversation participants
  - messages
  - favorites
  - questionnaire answers
- Real ID model using MongoDB ObjectId values on the backend
- Session-cookie auth routes for signup, login, logout, and session lookup
- API routes for profiles, projects, memberships, conversations, messages, favorites, and questionnaire answers
- A MongoDB health check route

## Important note

Prototype 7D is still a prototype.
The UI remains mostly local-state driven, but the backend layer is now present and ready to be connected screen by screen.
It will fail clearly when MongoDB Atlas is not configured.

## Required environment variables

Create a `.env.local` file locally or set these in Vercel:

```bash
OPENAI_API_KEY=
MONGODB_URI=
MONGODB_DB=prototype7d
APP_SESSION_SECRET=replace-with-a-long-random-secret
```

## Main backend routes

- `GET /api/health/mongodb`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET/PATCH /api/profiles/me`
- `GET/POST /api/projects`
- `GET /api/projects/[projectId]`
- `POST /api/projects/[projectId]/membership`
- `GET /api/conversations`
- `GET/POST /api/conversations/[conversationId]/messages`
- `GET/PUT /api/favorites`
- `GET/PUT /api/questionnaire`

## Suggested next integration steps

1. Replace temporary login with `POST /api/auth/login`
2. Replace temporary signup completion with `POST /api/auth/signup`
3. Persist created projects through `POST /api/projects`
4. Persist joined/left membership through `/api/projects/[projectId]/membership`
5. Load and send user chat messages through conversation routes
6. Persist favorites and questionnaire answers

## Deploy on Vercel

1. Push the repo to GitHub
2. Connect the repo to Vercel
3. Add the required environment variables
4. Deploy

If MongoDB Atlas is missing, the backend routes will return clear configuration errors instead of silently failing.
