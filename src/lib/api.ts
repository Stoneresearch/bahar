import axios from 'axios';
import { BlogPost } from '@/types';

export async function createBlogPost(post: Omit<BlogPost, 'id'>, token: string): Promise<BlogPost> {
    try {
        const response = await axios.post('/api/blog-posts', post, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
}

export async function updateBlogPost(post: BlogPost, token: string): Promise<BlogPost> {
    try {
        const response = await axios.put('/api/blog-posts', post, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

export async function deleteBlogPost(postId: string, token: string): Promise<void> {
    try {
        await axios.delete('/api/blog-posts', {
            data: { id: postId },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const response = await axios.get('/api/blog-posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}