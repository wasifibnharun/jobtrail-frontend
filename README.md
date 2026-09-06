# JobTrail Frontend

JobTrail is a private job application tracker for organizing opportunities through the Wishlist, Applied, Interview, Offer, and Rejected stages. This repository contains the React frontend; all displayed application data is loaded from the JobTrail API.

## Related Repository

- [JobTrail Backend](https://github.com/wasifibnharun/jobtrail-backend)

## Tech Stack

- React 18 and TypeScript
- Vite
- React Router 6
- Axios
- Tailwind CSS 4
- Lucide React
- TanStack Query
- dnd-kit
- Recharts
- React Hot Toast

## Features

- JWT login, registration, logout, persistent authentication, and silent token refresh
- Protected application routes
- API-powered dashboard statistics, recent applications, and responsive charts
- Full application details with a chronological activity timeline
- Five-column drag-and-drop Kanban board with optimistic status updates
- Server-side search, status filtering, and pagination stored in the URL
- Shared add and edit form with field-level API validation errors
- Optimistic deletion with an accessible confirmation modal
- Cached queries, background refetching, action toasts, skeletons, empty states, and retryable errors
- Persistent light and dark modes with system-preference detection
- Responsive layouts tested at a 390 px viewport

## Setup

### Prerequisites

- Node.js 20 or newer
- npm
- The JobTrail backend running locally

### Installation

```bash
git clone https://github.com/wasifibnharun/jobtrail-frontend.git
cd jobtrail-frontend
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

The default development configuration is:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`. The `.env` file is intentionally ignored by Git, and Vite must be restarted after changing it.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Routes

| Route | Access | Screen |
| --- | --- | --- |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/` | Protected | Dashboard and recent applications |
| `/applications` | Protected | Searchable and paginated application list |
| `/applications/new` | Protected | Add application form |
| `/applications/:id` | Protected | Full application record and activity timeline |
| `/applications/:id/edit` | Protected | Edit application form |
| `/board` | Protected | Drag-and-drop status board |

Protected routes redirect unauthenticated visitors to `/login`. Authentication tokens and the selected color theme persist across browser refreshes.

## Screenshots

### Dashboard

![JobTrail dashboard](screenshots/dashboard.png)

### Applications

![JobTrail applications list](screenshots/applications.png)

### Application Form

![JobTrail application form](screenshots/application-form.png)

### Mobile View

![JobTrail mobile layout](screenshots/mobile-view.png)

## Design Direction

JobTrail uses a clean, calm workspace design intended for frequent scanning and repeated actions. Neutral surfaces and restrained borders keep the interface focused, while emerald actions and distinct status colors provide hierarchy. Light and dark themes use the same layout and semantic colors so the experience remains familiar in either mode.

## Optional Enhancements

- **O-9:** The backend includes automated coverage for authentication, owner isolation, filtering, pagination, CRUD behavior, files, exports, analytics, throttling, and demo seeding.
- **O-10:** Application details include the complete record and an activity timeline.
- **O-11:** The Kanban board provides five status columns with drag-and-drop updates.
- **O-12:** The dashboard includes applications-per-month and status-distribution charts.
- **O-13:** Search, status, and page filters are shareable through URL parameters; search uses a 400 ms debounce.
- **O-14:** TanStack Query handles caching, background refetches, and optimistic mutations, with toasts and skeleton loading states.
- **O-15:** The responsive interface supports persistent dark mode and silently refreshes expired access tokens before replaying requests.

## Deployment

The frontend is designed for Vercel. Set `VITE_API_URL` to the deployed API URL, including the `/api` suffix, and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

The backend must include the Vercel origin in `CORS_ALLOWED_ORIGINS`.
