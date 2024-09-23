import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const blogPostSchema = z.object({
    id: z.string().optional(), // ID für PUT-Anfragen
    title: z.string().min(1).max(100),
    content: z.string().min(1),
    // authorName entfernt, da es nicht im Prisma Schema existiert
    // authorName: z.string().optional(), // authorName statt author
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
        return NextResponse.json(blogPosts); // createdAt wird hier automatisch zurückgegeben
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
                authorId: userId,
                // authorName entfernt
                // authorName: validatedData.authorName || 'Anonymous',
            },
        });
        console.log('New blog post created:', newBlogPost.id);
        return NextResponse.json(newBlogPost, { status: 201 }); // createdAt wird hier automatisch zurückgegeben
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
                // authorName entfernt
                // authorName: validatedData.authorName || 'Anonymous',
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