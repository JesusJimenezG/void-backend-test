# Void League Showcase: Architecture & Implementation Spec

This document outlines the detailed roadmap for restructuring the Void Backend codebase, implementing a premium React/Vite frontend, and deploying the consolidated stack via Docker Compose.

## 1. Project Restructuring Strategy

To ensure clean isolation between the API and UI services while maintaining a monorepo-style convenience for Docker:

- **Root Directory**: Contains orchestration files (`docker-compose.yml`, `.env`, `README.md`).
- **`/backend`**:
  - Moves: `src`, `test`, `scripts`, `nest-cli.json`, `package.json`, `tsconfig*.json`, etc.
  - Action: This encapsulates the existing NestJS application completely.
- **`/frontend`**:
  - New: initialized with `npm create vite@latest` (React + TypeScript).
  - Contains: Source code for the UI.

## 2. Frontend Design System ("Hextech Glass")

We will implement a custom CSS variable system to achieve the League of Legends "Hextech" aesthetic without heavy external UI libraries.

### Refined Color Palette

- **Backgrounds**:
  - `--bg-void-deep`: `#040a11` (Main background)
  - `--bg-glass`: `rgba(6, 28, 37, 0.7)` (Panels)
- **Accents**:
  - `--hextech-gold`: `#c8aa6e` (Borders, Highlights)
  - `--hextech-cyan`: `#00cfef` (Primary Actions, Glows)
  - `--hextech-magic`: `#1a4055` (Secondary backgrounds)
- **Status**:
  - `--win-green`: `#2deb90`
  - `--loss-red`: `#ff5859`

### Typography & Effects

- **Fonts**:
  - Headings: `Beaufort for LOL` (if available) or `Cinzel` / `Orbitron` (Google Fonts fallback).
  - Body: `Inter` or `Roboto` for readability.
- **Visual Effects**:
  - **Glassmorphism**: `backdrop-filter: blur(12px); border: 1px solid rgba(200, 170, 110, 0.3);`
  - **Glow**: `box-shadow: 0 0 15px rgba(0, 207, 239, 0.3);`

## 3. Frontend Architecture (React + Vite)

### Directory Structure

```text
/frontend
  ├── /src
  │   ├── /assets        # Static images (ranks, icons)
  │   ├── /components    # Reusable UI blocks
  │   ├── /hooks         # API integration logic
  │   ├── /pages         # Route views
  │   └── /styles        # Global CSS & Variables
```

### Core Components

1.  **`Layout.tsx`**:
    - Wraps the app.
    - Features a dynamic "living" background (canvas particles or video).
    - Contains the Global Search Header.
2.  **`SummonerSearch.tsx`**:
    - Centered hero input on the index page.
    - Animated transition to the top bar when search is submitted.
3.  **`SummonerDashboard.tsx`**:
    - **Header**: Summoner Icon, Level ring, and Rank Crest.
    - **Grid**:
      - **Left**: Ranked Stats (Wins/Losses/Winrate Graph).
      - **Center**: `MatchHistoryList` (Recent 5-10 matches).
      - **Right**: Top Champions (Mastery fallback).
4.  **`MatchTile.tsx`**:
    - Expandable accordion.
    - Collapsed: Champion Icon, K/D/A, Outcome (Win/Loss), Items.
    - Expanded: Basic damage stats.

### Data Layer

- **Client**: Native `fetch` with a custom `useFetch` hook for simplicity and zero dependencies.
- **Types**: Interfaces mirroring the Backend DTOs (`SummonerDTO`, `MatchDTO`, `SummaryDTO`).

## 4. API Integration Plan

The frontend will proxy requests or hit the backend directly. Given the Docker network, we expose the backend on a public port (e.g., `4000`) and the frontend consumes it.

| Feature         | Backend Endpoint                     | Frontend Hook               |
| :-------------- | :----------------------------------- | :-------------------------- |
| **Search**      | `GET /summoner/:region/:name`        | `useSummoner(region, name)` |
| **Matches**     | `GET /summary/:region/:name/matches` | `useMatches(region, name)`  |
| **Leaderboard** | `GET /summary/:region/leaderboard`   | `useLeaderboard(region)`    |

## 5. Infrastructure & Deployment (Dokploy)

This is the critical path for "One Click" deployment.

### 1. Backend Dockerfile (Existing + Tweaks)

- Ensure it listens on `0.0.0.0` to accept external Docker traffic.

### 2. Frontend Dockerfile (New)

Multi-stage build for optimal production size:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Nginx Config (`nginx.conf`)

- Handles `try_files $uri $uri/ /index.html;` to support React Router (SPA).

### 4. Docker Compose

- **Services**:
  - `void-backend`: Mapped `4000:4000`.
  - `void-frontend`: Mapped `3000:80`.
  - `void-postgres`: Database.
- **Network**: All services on `void-network`.
- **Environment**:
  - Frontend needs `VITE_API_URL` pointing to the public URL or relative path if using Nginx reverse proxy.

## 6. Execution Use Case

This `PLAN.md` serves as the master instruction set. The Assistant will:

1.  **Execute the folder move**.
2.  **Scaffold the Frontend** using the Design System specs.
3.  **Write the Docker configuration**.
4.  **Validate** by running the build command.
