# The Subreddit Vibe Check ⚡

> **Real-time mood and sentiment analytics dashboard for Reddit communities.**

An evaluation-grade, full-stack web application that allows users to search or select any Reddit community, fetches its top 50 "Hot" posts through a secure backend proxy communicating with the official Reddit API, executes zero-latency client-side sentiment analysis using the AFINN lexicon, and visualizes the community's emotional pulse across interactive charts, KPI metrics, and filterable post lists.

## 🔗 Live Deployment

| | Link |
|---|---|
| 🌐 **Frontend (Vercel)** | [https://reddit-delta-wheat.vercel.app](https://reddit-delta-wheat.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://reddit-vibe-check-api.onrender.com](https://reddit-vibe-check-api.onrender.com) |
| 📦 **GitHub Repository** | [https://github.com/srishith552-create/Reddit_](https://github.com/srishith552-create/Reddit_) |

---

## 📸 Overview

Reddit communities each have unique cultures, attitudes, and communication styles. **The Subreddit Vibe Check** answers the fundamental question: *"What's the mood of this community today?"*

- **Instant Vibe Evaluation**: Computes dominant sentiment (Positive, Neutral, Negative) and confidence scores across 50 hot posts.
- **Client-Side Sentiment Analysis**: Runs AFINN natural language processing directly in the browser without relying on external LLM APIs.
- **Interactive Visualizations**: Includes a Recharts Sentiment Distribution Donut Chart and a Sentiment Intensity Histogram.
- **Dynamic Post Explorer**: Filter posts by sentiment category and sort by upvotes, comment volume, sentiment polarity, and recency.

---

## 🛠️ Tech Stack

### **Frontend**
- **React (v18)**: UI component architecture and state management.
- **TypeScript**: Strict type safety across models and utilities.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Modern design system with dark obsidian palette and micro-animations.
- **Recharts**: Responsive SVG charting library (Donut & Bar charts).
- **Lucide React**: Clean, accessible iconography.
- **Sentiment**: AFINN-165 based client-side natural language processing.
- **Vitest**: Unit testing suite.

### **Backend**
- **Node.js & Express**: High-performance HTTP server and API proxy.
- **TypeScript**: Strict type contracts matching Reddit API schemas.
- **Axios**: HTTP client with timeouts, retry capabilities, and error interceptors.
- **express-rate-limit**: Protection against accidental flooding and Reddit rate-limit exhaustion.
- **cors & dotenv**: Secure origin handling and environment configuration.

---

## 🏛️ Architecture & Security

```text
User Browser (React + Vite)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ React Frontend                                              │
│  ├── Subreddit Search & Input Normalizer                    │
│  ├── In-Browser AFINN Sentiment Engine                      │
│  ├── Aggregate Statistics & KPI Calculator                  │
│  ├── Recharts Visualizations (Donut & Histograms)           │
│  └── Client-Side Filterable & Sortable Post Grid            │
└─────────────────────────────────────────────────────────────┘
    │  HTTP (e.g. GET /api/subreddit/programming/hot?limit=50)
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Express Backend (Node.js + TypeScript)                      │
│  ├── Subreddit Validator & Parameter Sanitizer              │
│  ├── Reddit OAuth2 Manager (Bearer token caching)           │
│  ├── Centralized Error Handler (400, 403, 404, 429, 503)     │
│  └── Response Normalizer (Standardized RedditPost model)     │
└─────────────────────────────────────────────────────────────┘
    │  OAuth2 Client Credentials (Bearer <access_token>)
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Reddit Official API (https://oauth.reddit.com/r/.../hot)    │
└─────────────────────────────────────────────────────────────┘
```

### Why Keep Credentials Server-Side?
1. **Security**: Reddit `client_secret` credentials should never be exposed in client JavaScript bundles where any user could extract them via DevTools.
2. **CORS & Rate Limits**: Reddit API blocks direct browser CORS requests to `oauth.reddit.com`. The Express server acts as a validated API gateway.
3. **Token Caching**: OAuth2 bearer tokens (valid for 1 hour) are cached in memory on the backend, preventing redundant authorization round-trips.

---

## ⚙️ Reddit API Setup

The application supports the **Official Reddit OAuth2 Application-Only flow** (Client Credentials Grant), with an automatic fallback to the public JSON feed if credentials are not configured.

### Step 1: Create a Reddit Developer App
1. Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps).
2. Scroll to the bottom and click **"are you a developer? create an app..."** (or **"create another app..."**).
3. Fill in the fields:
   - **name**: `SubredditVibeCheck`
   - **App type**: Select **`script`** (or `web app`).
   - **description**: `Take-home assignment sentiment analyzer`
   - **about url**: (leave blank or use `http://localhost:3001`)
   - **redirect uri**: `http://localhost:3001`
4. Click **"create app"**.

### Step 2: Extract Your Keys
- **Client ID**: The string displayed underneath the app name (e.g. `k8AbC_dEf1234g`).
- **Client Secret**: The string next to `secret`.

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```env
PORT=3001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Reddit OAuth2 Credentials
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=web:subreddit-vibe-check:v1.0.0 (by /u/YOUR_REDDIT_USERNAME)
```

*(If you don't provide credentials, the backend will automatically attempt Reddit's public endpoint with the custom User-Agent).*

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd Reddit-dashboard

# Install all root, server, and client dependencies
npm run install:all
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Optionally add your Reddit `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` into `.env`)*

### 3. Run in Development Mode
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 🧪 Running Tests

The application includes automated unit tests covering input normalization, subreddit validation, sentiment classification thresholds, and statistical calculations:

```bash
npm test
```

To run tests in watch mode:
```bash
cd client && npx vitest
```

---

## 📦 Production Build & Deployment

### Build Locally
```bash
npm run build
```
This will compile the TypeScript backend into `server/dist` and build the optimized React bundle into `client/dist`.

### Start Production Server
```bash
npm start
```
The Express server will serve both the `/api` endpoints and the static React client from port `3001`.

### Cloud Deployment (Render / Railway / Fly.io)
1. **Single-Service Deploy**: Connect repository to Render/Railway.
2. **Build Command**: `npm run install:all && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3001` (or provided dynamically)
   - `REDDIT_CLIENT_ID`: `<your-reddit-client-id>`
   - `REDDIT_CLIENT_SECRET`: `<your-reddit-client-secret>`
   - `REDDIT_USER_AGENT`: `web:subreddit-vibe-check:v1.0.0 (by /u/YOUR_USERNAME)`

---

## 📂 Project Structure

```text
Reddit-dashboard/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable presentation components
│   │   │   ├── Header.tsx             # Brand header with status indicator
│   │   │   ├── SubredditSearch.tsx    # Search input with auto-normalization
│   │   │   ├── SuggestedSubreddits.tsx# Quick-select chip suggestions
│   │   │   ├── SubredditOverview.tsx  # Dominant vibe badge and summary
│   │   │   ├── StatsCards.tsx         # KPI metrics cards (counts & %)
│   │   │   ├── SentimentChart.tsx     # Recharts Donut distribution chart
│   │   │   ├── SentimentScoreChart.tsx# Recharts Bar histogram
│   │   │   ├── PostControls.tsx       # Filter tabs & Sort dropdown
│   │   │   ├── PostCard.tsx           # Rich Reddit post card with badges
│   │   │   ├── PostList.tsx           # Responsive post cards grid
│   │   │   ├── LoadingState.tsx       # Animated skeleton loaders
│   │   │   ├── ErrorState.tsx         # User-friendly error alert with retry
│   │   │   └── EmptyState.tsx         # Welcome screen with feature highlights
│   │   ├── hooks/
│   │   │   └── useSubreddit.ts        # Custom hook for data, cache, & filters
│   │   ├── services/
│   │   │   └── redditApi.ts           # Client API service
│   │   ├── types/
│   │   │   └── reddit.ts              # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── sentiment.ts           # AFINN sentiment analysis engine
│   │   │   ├── subreddit.ts           # Input normalization & regex validator
│   │   │   ├── stats.ts               # Percentage & KPI aggregations
│   │   │   └── __tests__/             # Unit tests suite
│   │   ├── App.tsx                    # Main dashboard layout
│   │   ├── index.css                  # Tailwind styles & theme variables
│   │   └── main.tsx                   # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── middleware/
│   │   │   └── errorHandler.ts        # Centralized HTTP error handler
│   │   ├── routes/
│   │   │   └── reddit.ts              # Subreddit API routes & validation
│   │   ├── services/
│   │   │   └── redditService.ts       # OAuth2 token manager & Reddit proxy
│   │   ├── types/
│   │   │   └── reddit.ts              # Server TypeScript interfaces
│   │   └── index.ts                   # Express app configuration & static server
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules (secrets & node_modules)
├── package.json                # Root package manager with unified scripts
└── README.md                   # Full documentation
```

---

## 🧠 Major Design Decisions

1. **Client-Side vs Server-Side Sentiment Analysis**:
   - The sentiment analysis is executed entirely on the client using the lightweight `sentiment` library. This meets the assignment requirement, eliminates backend processing bottlenecks, enables zero-latency sorting/filtering, and keeps hosting requirements minimal.

2. **In-Memory Caching (`useSubreddit`)**:
   - The frontend caches previously fetched subreddits in an in-memory `Map`. Switching between suggested subreddits or returning to a previous search is instantaneous and saves unnecessary API calls.

3. **Defensive API Normalization**:
   - Reddit's API response includes complex structures with null values (e.g. deleted authors, missing thumbnails, pinned posts). The backend maps every raw child into a strictly typed `RedditPost` object before returning it to the browser.

4. **Documented Sentiment Classification Thresholds**:
   - In `src/utils/sentiment.ts`:
     - **Positive**: AFINN score `> 0` (or comparative `> 0.05`)
     - **Negative**: AFINN score `< 0` (or comparative `< -0.05`)
     - **Neutral**: AFINN score `=== 0` (or `-0.05 <= comparative <= 0.05`)

---

## ⚠️ Limitations & Notes

- **Reddit Rate Limits**: Unauthenticated public requests are subject to Reddit IP rate limits. Supplying `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` in `.env` is strongly recommended for high-volume usage.
- **Title Lexicon vs Context**: AFINN classifies sentiment based on vocabulary in post titles. Sarcasm or nuanced slang may occasionally be categorized as neutral.
- **Private Subreddits**: Quarantined or private subreddits return 403 Forbidden as per Reddit's API policy; the application handles these with friendly user messages.

---

## 📄 License
MIT License - Created for Full Stack Developer Internship Evaluation.
