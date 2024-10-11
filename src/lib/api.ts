import { BlogPost } from '@/types';

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    const response = await fetch('/api/blog-posts');
    if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
    }
    return response.json();
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
    const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to create blog post');
    }
    return response.json();
}

export async function updateBlogPost(post: BlogPost): Promise<BlogPost> {
    const response = await fetch(`/api/blog-posts`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to update blog post');
    }
    return response.json();
}

export async function deleteBlogPost(postId: string): Promise<void> {
    const response = await fetch(`/api/blog-posts`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete blog post');
    }
}