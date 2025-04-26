# theM Studios Website - Next.js Migration

This is a migrated version of the original theM Studios website from React to Next.js.

## Features

- Preserved all original functionality and styling
- Implemented modern Firebase v9 SDK
- Migrated from React Router to Next.js routing
- Updated Redux implementation using Redux Toolkit
- Improved authentication flow
- Added SEO optimization with Next.js Head component

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

```bash
npm run build
```

## Deployment

The application can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform.

```bash
npm run build
npm run start
```

## Structure

- `/src/pages`: Next.js pages (replacing React Router routes)
- `/src/components`: React components
- `/src/js`: Redux store, actions, reducers, and action creators
- `/src/styles`: CSS and style files
- `/src/firebase.js`: Firebase configuration

## Key Changes

1. Replaced React Router with Next.js File-System Based Routing
2. Updated Firebase implementation to v9 SDK with modular imports
3. Replaced Redux implementation with Redux Toolkit
4. Added SSR capability for improved SEO and performance
5. Improved metadata management with Next.js Head component
6. Enhanced authentication flow with Next.js router

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
