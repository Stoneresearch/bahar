# Bahar Sener's Portfolio Page

## Overview

Welcome to the official portfolio page of Bahar Sener, an artist whose work spans various mediums and styles. This project is designed to showcase Bahar's artistic journey, providing a platform for visitors to explore her creations and learn more about her inspirations. Built with Next.js and React, this portfolio is not only a visual delight but also a robust application that can be easily bootstrapped and customized.

## Features

- **Artistic Showcase**: Display a curated selection of Bahar Sener's artworks, including paintings, digital art, and installations.
- **Responsive Design**: Ensures a seamless viewing experience on both mobile and desktop devices.
- **Blog Section**: Includes a blog for sharing insights, stories, and updates about Bahar's artistic journey.
- **Contact Form**: Allows visitors to reach out directly for inquiries or collaborations.
- **Image Gallery**: A dynamic gallery to explore high-resolution images of artworks.
- **Admin Dashboard**: Manage content with ease, including blog posts and gallery updates.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Clerk (for admin access)
- **State Management**: React Hooks
- **Styling**: Tailwind CSS, Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/bahar-sener-portfolio.git
   cd bahar-sener-portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```plaintext
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

- **`/src/app`**: Next.js app router and page components
- **`/src/components`**: Reusable React components, including the landing page and gallery
- **`/src/lib`**: Utility functions and Prisma client
- **`/src/types`**: TypeScript type definitions
- **`/prisma`**: Prisma schema and migrations

## API Routes

- **`GET /api/artworks`**: Fetch all artworks
- **`POST /api/blog-posts`**: Create a new blog post
- **`PUT /api/blog-posts`**: Update an existing blog post
- **`DELETE /api/blog-posts/:id`**: Delete a blog post

## Contributing

Contributions are welcome! If you have ideas or improvements, please feel free to submit a Pull Request. Let's make this project even better together.

## License

This project is licensed under the MIT License.

---

Crafted with love and care by Studio AAL.
