# Gather

A MERN social network: feed, posts with media, 24-hour stories, connection
requests, direct messaging and profiles. Built solo and deployed.

**Live:** https://gather-six.vercel.app

## Stack

| Layer | Choice |
| --- | --- |
| Client | React, Vite, Redux Toolkit, React Router, Tailwind CSS 4 |
| Server | Node.js, Express, Mongoose |
| Auth | Clerk (client + `@clerk/express` middleware) |
| Jobs & email | Inngest, Nodemailer over Brevo SMTP |
| Media | ImageKit, Multer |
| Realtime | Server-sent events (no WebSocket server) |

## Features

- **Feed** — posts from you, your connections and people you follow.
- **Posts** — text, image, or text with up to four images; like/unlike.
- **Stories** — text, image or video; expire after 24 hours.
- **Connections** — send, accept and reject requests, capped at 20 outgoing
  requests per 24 hours. Accepting adds each user to the other's connections.
- **Follow** — one-way following, independent of connections.
- **Discover** — case-insensitive search across username, name, email and
  location.
- **Profiles** — avatar and cover photo, bio, location, counters.
- **Messaging** — live delivery over server-sent events, unread tracking, and
  a daily email digest of unseen messages.

## Why server-sent events

Live chat runs on SSE rather than WebSockets. One `EventSource` per session is
just an HTTP response that stays open, so there is no stateful socket server to
deploy, heartbeat or reconnect. The constraint is real, though: SSE is
server-to-client only. Message history therefore always travels over a normal
POST (`/api/message/get`), and the stream carries only "something new
arrived". The stream is a nudge, never the source of truth.

That design has one deployment consequence worth knowing: the open responses
live in an in-memory map keyed by user id, so the API expects a **single
long-running instance**. A horizontally scaled or serverless deployment would
need a shared pub/sub (Redis, Ably, Postgres `LISTEN/NOTIFY`) behind it.

## Background jobs (Inngest)

| Function | Trigger | Does |
| --- | --- | --- |
| `sync-user-from-clerk` | `clerk/user.created` | Creates the Mongo user document; makes the username unique by appending a random suffix on collision |
| `update-user-from-clerk` | `clerk/user.updated` | Syncs name, email and avatar |
| `delete-user-with-clerk` | `clerk/user.deleted` | Removes the user document |
| `send-new-connection-request-reminder` | `app/connection-request` | Emails the recipient, then sleeps 24 hours and emails again only if still pending |
| `story-delete` | `app/story.delete` | Deletes the story after 24 hours |
| `send-unseen-messages-notification` | cron, 09:00 America/New_York | Emails each user a count of unseen messages |

Stories are also protected by a Firestore-style TTL: `expiresAt` carries
`index: { expires: 0 }`, so Mongo removes expired documents even if the Inngest
run is lost.

## Data model

| Collection | Key fields |
| --- | --- |
| `users` | `_id` (= Clerk id), `email`, `full_name`, `username`, `bio`, `profile_picture`, `cover_photo`, `location`, `followers`, `following`, `connections` |
| `posts` | `user`, `content`, `image_urls`, `post_type`, `likes_count` |
| `stories` | `user`, `content`, `media_url`, `media_type`, `view_count`, `background_color`, `expiresAt` |
| `messages` | `from_user_id`, `to_user_id`, `text`, `message_type`, `media_url`, `seen` |
| `connections` | `from_user_id`, `to_user_id`, `status` (`pending` \| `accepted`) |

Uploaded images are stored by ImageKit and served as WebP at
`quality:auto`, width 1280 (512 for avatars).

## Project structure

```text
server/
├── configs/      db, ImageKit, Multer, Nodemailer
├── controllers/  user, post, story, message
├── inngest/      client + all functions
├── middleware/   Clerk-backed `protect`
├── models/       User, Post, Story, Message, Connection
├── routes/       user, post, story, message
└── server.js
client/
└── src/
    ├── api/       axios instance
    ├── app/       Redux store
    ├── features/  user, connections, messages slices
    ├── components/ Sidebar, PostCard, StoriesBar, ChatBox pieces
    └── pages/     Feed, Messages, ChatBox, Connections, Discover, Profile, CreatePost

Getting started

# server
cd server && npm install && npm run server

# client
cd client && npm install && npm run dev

Environment variables

server/.env

┌────────────────────────────────────────────────────────────────────┬──────────────────────────────┐
│                              Variable                              │           Purpose            │
├────────────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ MONGODB_URL                                                        │ MongoDB connection string    │
├────────────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT │ Media uploads                │
├────────────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ SMTP_USER / SMTP_PASSS / SENDER_EMAIL                              │ Brevo SMTP credentials       │
├────────────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ FRONTEND_URL                                                       │ Base URL used in email links │
├────────────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ PORT                                                               │ Defaults to 4000             │
└────────────────────────────────────────────────────────────────────┴──────────────────────────────┘

Inngest keys (INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY) are read by the SDK
itself; set them in the Inngest dashboard or your deployment env.

client/.env

┌────────────────────────────┬───────────────────────────────────────────────┐
│          Variable          │                    Purpose                    │
├────────────────────────────┼───────────────────────────────────────────────┤
│ VITE_BASEURL               │ API base URL (also used for the SSE endpoint) │
├────────────────────────────┼───────────────────────────────────────────────┤
│ VITE_CLERK_PUBLISHABLE_KEY │ Clerk frontend key                            │
└────────────────────────────┴───────────────────────────────────────────────┘

The client throws on startup if the Clerk key is missing.

API

┌────────┬───────────────────────────────────────┬────────────────────────────────────────────┐
│ Method │                 Route                 │                  Purpose                   │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/user/data                        │ Current user                               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/update                      │ Update profile, avatar, cover              │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/discover                    │ Search users                               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/follow | /api/user/unfollow │ Follow graph                               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/connect                     │ Send connection request (20/24h)           │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/accept                      │ Accept request                             │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/user/connections                 │ Connections, followers, following, pending │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/user/profiles                    │ Public profile + their posts               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/user/recent-messages             │ Recent conversations                       │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/post/add                         │ Create post (≤ 4 images)                   │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/post/feed                        │ Feed for the current user                  │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/post/like                        │ Toggle like                                │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/story/create                     │ Create story                               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/story/get                        │ Stories from your circle, last 24h         │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ GET    │ /api/message/:userId                  │ SSE stream                                 │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/message/send                     │ Send message (text or image)               │
├────────┼───────────────────────────────────────┼────────────────────────────────────────────┤
│ POST   │ /api/message/get                      │ Conversation history + mark seen           │
└────────┴───────────────────────────────────────┴────────────────────────────────────────────┘
