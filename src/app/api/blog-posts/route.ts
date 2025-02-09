import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const blogPostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1).max(100),
    content: z.string().min(1),
    imageUrl: z.string().optional(),
    authorName: z.string().optional(),
});

function validateBlogPostData(data: unknown) {
    return blogPostSchema.parse(data);
}

export async function GET() {
    console.log('GET request received for blog posts');
    try {
        const blogPosts = await prisma.blogPost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log('Blog posts fetched:', blogPosts.length);
        return NextResponse.json(blogPosts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    console.log('POST request received for creating a blog post');
    try {
        const { userId } = getAuth(req);
        console.log('User ID:', userId);

        if (!userId) {
            console.log('Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        console.log('Received blog post data:', body);

        const validatedData = validateBlogPostData(body);

        console.log('Creating new blog post');
        const newBlogPost = await prisma.blogPost.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                imageUrl: validatedData.imageUrl,
                authorId: userId,
                authorName: validatedData.authorName || 'Anonymous',
            },
        });
        console.log('New blog post created:', newBlogPost.id);
        return NextResponse.json(newBlogPost, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
        }
        console.error('Error creating blog post:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('Prisma error code:', error.code);
            return NextResponse.json({ error: 'Database error', code: error.code }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    console.log('PUT request received for updating a blog post');
    try {
        const { userId } = getAuth(req);
        console.log('User ID:', userId);

        if (!userId) {
            console.log('Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        console.log('Received blog post data:', body);

        const validatedData = validateBlogPostData(body);

        console.log('Updating blog post');
        const updatedBlogPost = await prisma.blogPost.update({
            where: { id: validatedData.id },
            data: {
                title: validatedData.title,
                content: validatedData.content,
                imageUrl: validatedData.imageUrl,
                authorName: validatedData.authorName,
            },
        });
        console.log('Blog post updated:', updatedBlogPost.id);
        return NextResponse.json(updatedBlogPost, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
        }
        console.error('Error updating blog post:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('Prisma error code:', error.code);
            return NextResponse.json({ error: 'Database error', code: error.code }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    console.log('DELETE request received for deleting a blog post');
    try {
        const { userId } = getAuth(req);
        console.log('User ID:', userId);

        if (!userId) {
            console.log('Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();
        console.log('Deleting blog post with ID:', id);

        await prisma.blogPost.delete({
            where: { id },
        });
        console.log('Blog post deleted:', id);
        return NextResponse.json({ message: 'Blog post deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('Prisma error code:', error.code);
            return NextResponse.json({ error: 'Database error', code: error.code }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Modify the fetchBlogPosts function to include authorName and createdAt
export async function fetchBlogPosts() {
    // Fetch posts from the database
    const posts = await prisma.blogPost.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            authorName: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.content.substring(0, 100), // Create an excerpt from content
        image: post.imageUrl,
        authorName: post.authorName,
        createdAt: post.createdAt,
    }));
}
