import prisma from './prisma';
import { BlogPost } from '@/types';

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    try {
        const newPost = await prisma.blogPost.create({
            data: {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                authorName: post.authorName,
            },
        });
        return newPost;
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
}

export async function updateBlogPost(post: BlogPost): Promise<BlogPost> {
    try {
        const updatedPost = await prisma.blogPost.update({
            where: { id: post.id },
            data: {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                authorName: post.authorName,
            },
        });
        return updatedPost;
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

export async function deleteBlogPost(postId: string): Promise<void> {
    try {
        const response = await fetch(`/api/blog-posts/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete blog post');
        }
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl || '',
            authorName: post.authorName || '',
            excerpt: post.content.substring(0, 100),
            status: post.status || 'Draft',
        }));
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}

export async function fetchBlogPostById(postId: string): Promise<BlogPost | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: postId },
        });
        if (!post) return null;
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl || '',
            authorName: post.authorName || '',
            excerpt: post.content.substring(0, 100),
            status: post.status || 'Draft',
        };
    } catch (error) {
        console.error('Error fetching blog post by ID:', error);
        throw error;
    }
}