import axios from 'axios';

export async function createBlogPost(post: { title: string; content: string; authorName: string }, token: string) {
    try {
        console.log('Sending POST request to create blog post:', post);
        const response = await axios.post('/api/blog-posts', post, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('POST request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
}

export async function updateBlogPost(post: { id: string; title: string; content: string; authorName: string }, token: string) {
    try {
        console.log('Sending PUT request to update blog post:', post);
        const response = await axios.put('/api/blog-posts', post, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('PUT request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

export async function deleteBlogPost(postId: string, token: string) {
    try {
        console.log('Sending DELETE request to delete blog post with ID:', postId);
        const response = await axios.delete('/api/blog-posts', {
            data: { id: postId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('DELETE request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

export async function fetchBlogPosts() {
    try {
        console.log('Sending GET request to fetch blog posts');
        const response = await axios.get('/api/blog-posts');
        console.log('GET request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}