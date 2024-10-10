# Blog Post Admin Dashboard

## Overview

This project is a modern, responsive blog post administration dashboard built with Next.js, React, and Prisma. It features user authentication via Clerk, a sleek UI with Tailwind CSS, and full CRUD operations for managing blog posts.

## Features

- User authentication and authorization with Clerk
- Responsive design for mobile and desktop
- Blog post management (Create, Read, Update, Delete)
- Rich text editor for blog post content
- Image upload functionality
- Admin-only access to dashboard

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Clerk
- **State Management**: React Hooks
- **Styling**: Tailwind CSS, Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/blog-post-admin.git
   cd blog-post-admin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/app`: Next.js app router and page components
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and Prisma client
- `/src/types`: TypeScript type definitions
- `/prisma`: Prisma schema and migrations

## API Routes

- `GET /api/blog-posts`: Fetch all blog posts
- `POST /api/blog-posts`: Create a new blog post
- `PUT /api/blog-posts`: Update an existing blog post
- `DELETE /api/blog-posts/:id`: Delete a blog post

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
