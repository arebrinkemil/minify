# Minify - URL Shortener

This is a URL shortener application built with Next.js, TypeScript and for
validation Zod. All urls are saved in a Vercel Postgres database and the ui is
using Shadcn with Tailwind.

## Features

- Shorten any URL
- Expiration date
- Limit the maximum number of views
- Create an account to save shortend URL's
- Dashboard to update saved URL's
- QR code for url's

### Prerequisites

- Vercel account
- Vercel postgres

### Installation

```bash
# Clone repo
git clone https://github.com/arebrinkemil/minify.git

# CD in to project
cd minify

# Install node_modules
npm i
```

#### Vercel postrgres

First set up a new vercel postgres database by following the
[`documentation`](https://vercel.com/docs/storage/vercel-postgres/quickstart)

When your database is created and linked to your project, then seed the database

```bash
# Run seed script
npm run seed
```

#### Next Auth

To generate a `NEXTAUTH_SECRET` run this command in your terminal

```bash
openssl rand -base64 32
```

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

#### Localhost

```bash
# Start loclhost
npm run dev
```
