# Chatterra

Chatterra is a Reddit-style social platform where users can create communities, share posts, and discuss topics through threaded comments.

The project demonstrates a full-stack social media architecture using modern web technologies, with a focus on authentication, relational data modeling, access control, and efficient frontend data management.

**Live Demo:** [Chatterra](https://chatterra.vercel.app/)

---

## Features

* User authentication with Email, Google, and GitHub
* Create and browse communities
* Create posts within communities
* Optional post images
* Comment on posts
* Reply to comments with threaded discussions
* Upvote and downvote posts
* User profiles
* Community-specific feeds
* Global feed
* Search posts, communities, and users
* Linkify URLs, mentions, and hashtags
* Responsive UI

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* React Router
* TanStack Query
* Tailwind CSS
* Vite
* Linkify

### Backend / Infrastructure

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security (RLS)

---

## Architecture Overview

Chatterra follows a client-server architecture with Supabase providing the backend services.

### Frontend Responsibilities

* UI rendering
* Client-side routing
* Data fetching and caching with TanStack Query
* Client-side state management
* Content formatting and linkification

### Backend Responsibilities

* User authentication
* Database operations
* Authorization and access control through Row Level Security
* Post image storage
* Server-side data validation and operations through PostgreSQL

---

## Project Structure

The application is organized into reusable React components, pages, utilities, and Supabase-related functionality.

```text
src/
├── components/     # Reusable UI components
├── pages/          # Application pages
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── lib/            # Client and service configuration
└── ...
```

---

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/hlakokabelo/Chatterra-social-media-app.git
cd Chatterra-social-media-app
npm install
```

Create a `.env` file with your Supabase configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

---

## Testing

Chatterra uses Vitest for testing.

```bash
npm run test
```

---

## License

This project is licensed under the MIT License.
