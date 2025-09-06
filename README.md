# Inventory App

A modern inventory management application built with Next.js, React, Prisma, Clerk, Supabase, Radix UI, and Tailwind CSS.

Live demo: [inventory-app-blue.vercel.app](https://inventory-app-blue.vercel.app)

## Features

- User authentication and management via Clerk
- Inventory data stored and managed using Prisma ORM
- UI components powered by Radix UI
- Real-time analytics and cloud functions via Supabase and Vercel
- Responsive design with Tailwind CSS
- Table management with TanStack React Table
- Theming support via next-themes
- Avatar, Checkbox, Dialog, Dropdown, Navigation, Select, Separator, Slot, Tooltip components from Radix UI

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Nonamechick/inventory-app.git
cd inventory-app
npm install
```

### Environment Variables

You may need to set up environment variables for Clerk, Supabase, and your database connection. See `.env.example` (if available) or check integration docs for:

- Clerk API keys
- Supabase project URL and API key
- Database URL (for Prisma)

### Database Setup

Generate Prisma client and migrate your database:

```bash
npx prisma generate
npx prisma migrate dev
```

### Development

Run the development server:

```bash
npm run dev
```

### Production Build

Build and start:

```bash
npm run build
npm start
```

For Vercel deploys, a special script runs Prisma generate before building:

```bash
npm run vercel-build
```

### Linting

```bash
npm run lint
```

## Scripts

- `dev`: Run Next.js development server with Turbopack
- `build`: Build Next.js app with Turbopack
- `start`: Start Next.js production server
- `lint`: Run ESLint
- `vercel-build`: Prisma generate + Next.js build for Vercel

## Tech Stack

- **Next.js** (15.5)
- **React** (19.1)
- **Prisma** (ORM)
- **Clerk** (auth)
- **Supabase** (cloud functions/DB)
- **Radix UI** (UI components)
- **Tailwind CSS** (styling)
- **TanStack Table** (tables)
- **Lucide React** (icons)
- **Sonner** (notifications)
