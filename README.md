# VOID - League of Legends Stats Tracker

A premium League of Legends stats tracking application with a beautiful Hextech-inspired UI. Built with NestJS backend and React + Vite frontend. Fully compliant with the latest Riot API v5 standards (Riot ID & PUUID support).

![VOID Screenshot](docs/screenshot.png)

## 🚀 Features

- **Summoner Search**: Look up any player by Riot ID
- **Match History**: View detailed match statistics with expandable cards
- **Ranked Stats**: Track Solo/Duo and Flex queue rankings
- **Premium UI**: Hextech Glass design system with particles and animations

## 📁 Project Structure

```
void-backend-test/
├── backend/          # NestJS API server
│   ├── src/          # Source code
│   ├── test/         # Test files
│   └── Dockerfile    # Production build
├── frontend/         # React + Vite application
│   ├── src/          # Source code
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS design system
│   │   └── types/        # TypeScript interfaces
│   ├── Dockerfile    # Production build with nginx
│   └── nginx.conf    # Web server configuration
├── docker-compose.yml      # Production orchestration
└── docker-compose.dev.yml  # Development orchestration
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm` or use corepack: `corepack enable`)
- Docker & Docker Compose
- Riot API Key ([Get one here](https://developer.riotgames.com/))

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd void-backend-test
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env and add your RIOT_API_KEY
   ```

3. **Start development servers**

   ```bash
   # Using Docker (recommended)
   docker-compose -f docker-compose.dev.yml up

   # Or manually:
   # Backend
   cd backend && pnpm install && pnpm run start:dev

   # Frontend (in another terminal)
   cd frontend && pnpm install && pnpm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:4000
   - Swagger Docs: http://localhost:4000/api

### Production Deployment (Dokploy / Docker Compose)

This project is optimized for deployment on **Dokploy** using Docker Compose.

**Resource Configuration:**
To ensure a lightweight footprint suitable for showcase environments, the `docker-compose.yml` includes specific resource limits:

- **Database**: 128MB Limit / 64MB Reservation
- **Backend**: 256MB Limit / 128MB Reservation
- **Frontend**: 96MB Limit / 48MB Reservation
- **Total Max Footprint**: ~480MB RAM

**Deployment Steps:**

1.  Connect your repository to Dokploy.
2.  Select "Docker Compose" as the deployment type.
3.  Set the Environment Variables in the Dokploy UI (specifically `RIOT_API_KEY`).
4.  Deploy! Dokploy will respect the `deploy.resources` configuration in the compose file.

```bash
# To test production build locally:
docker-compose up -d --build
```

## 🎨 Design System

The frontend uses the **Hextech Glass** design system, featuring:

- **Color Palette**: Void deep backgrounds with gold and cyan accents
- **Typography**: Cinzel for headings, Inter for body text
- **Effects**: Glassmorphism, particle animations, glows
- **Components**: Glass panels, animated buttons, status indicators

## 📡 API Endpoints

A complete Postman collection is available at `backend/void-backend.postman_collection.json`. Import it into Postman to explore the API.

| Endpoint                                   | Description             |
| ------------------------------------------ | ----------------------- |
| `GET /summoner/:region/:gameName/:tagLine` | Get summoner by Riot ID |
| `GET /summary/:region/:gameName/:tagLine`  | Get player summary      |
| `GET /match/:region/:gameName/:tagLine`    | Get recent matches      |
| `GET /league/:region/:gameName/:tagLine`   | Get league entries      |

## 🔧 Environment Variables

| Variable            | Description       | Default                 |
| ------------------- | ----------------- | ----------------------- |
| `POSTGRES_USER`     | Database username | `void`                  |
| `POSTGRES_PASSWORD` | Database password | `void`                  |
| `POSTGRES_DB`       | Database name     | `void`                  |
| `RIOT_API_KEY`      | Your Riot API key | Required                |
| `VITE_API_URL`      | Backend API URL   | `http://localhost:4000` |

## 📜 License

This project is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.

---

Built with ❤️ using NestJS, React, and the power of the Void.
