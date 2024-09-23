'use client';

import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { BlogPostEditor } from '../../components/BlogPostEditor';
import { createBlogPost, updateBlogPost, deleteBlogPost, fetchBlogPosts } from '../../lib/api';
import { getAuthToken } from '../actions/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
    const { userId } = useAuth();
    const { isSignedIn, user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showEditor, setShowEditor] = useState(false);
    const [blogPosts, setBlogPosts] = useState<{ id: string; title: string; content: string; authorName: string; createdAt: string }[]>([]);
    const [editingPost, setEditingPost] = useState<{ id: string; title: string; content: string; authorName: string; createdAt: string } | null>(null);

    useEffect(() => {
        if (isLoaded && user) {
            const userRole = user.publicMetadata.role;
            setIsAdmin(userRole === 'admin');
        }

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [isLoaded, user]);

    useEffect(() => {
        async function loadBlogPosts() {
            try {
                const posts = await fetchBlogPosts();
                setBlogPosts(posts);
            } catch (error) {
                console.error('Error loading blog posts:', error);
            }
        }
        loadBlogPosts();
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        redirect('/sign-in');
    }

    if (!isSignedIn) {
        return <div>Not logged in</div>;
    }

    if (!isAdmin) {
        return (
            <div>
                <p>Access denied. You need admin rights.</p>
                <p>User ID: {userId}</p>
                <p>Is Signed In: {isSignedIn.toString()}</p>
                <p>Is Admin: {isAdmin.toString()}</p>
                <p>Public Metadata: {JSON.stringify(user?.publicMetadata)}</p>
            </div>
        );
    }

    const handleSubmit = async (post: { title: string; content: string; authorName: string }) => {
        try {
            const token = await getAuthToken();
            if (token === null) {
                throw new Error('Authentication token is null');
            }
            let response;
            if (editingPost) {
                console.log('Updating post:', post);
                response = await updateBlogPost({ ...post, id: editingPost.id }, token);
            } else {
                console.log('Creating post:', post);
                response = await createBlogPost(post, token);
            }
            if (response.error) {
                throw new Error(response.error);
            }
            alert('Blog post saved successfully!');
            setShowEditor(false);
            setEditingPost(null);
            setBlogPosts(await fetchBlogPosts());
        } catch (error) {
            console.error('Error saving blog post:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                alert(`Error saving blog post: ${error.response?.data?.error || error.message}`);
            } else if (error instanceof Error) {
                alert(`Error saving blog post: ${error.message}`);
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    const handleEdit = (post: { id: string; title: string; content: string; authorName: string; createdAt: string }) => {
        console.log('Editing post:', post);
        setEditingPost(post);
        setShowEditor(true);
    };

    const handleDelete = async (postId: string) => {
        try {
            const token = await getAuthToken();
            if (token === null) {
                throw new Error('Authentication token is null');
            }
            console.log('Deleting post with ID:', postId);
            await deleteBlogPost(postId, token);
            alert('Blog post deleted successfully!');
            setBlogPosts(await fetchBlogPosts());
        } catch (error) {
            console.error('Error deleting blog post:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                alert(`Error deleting blog post: ${error.response?.data?.error || error.message}`);
            } else if (error instanceof Error) {
                alert(`Error deleting blog post: ${error.message}`);
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl">Admin Area</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
            <div className="mb-8 text-right text-xl font-bold text-gray-700">
                {currentTime.toLocaleString()}
            </div>
            <button
                onClick={() => setShowEditor(true)}
                className="mb-8 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
                Create New Blog Post
            </button>
            {showEditor && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                        <BlogPostEditor
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowEditor(false);
                                setEditingPost(null);
                            }}
                            authorName={`${user?.firstName} ${user?.lastName}`}
                            initialData={editingPost ?? undefined}
                        />
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {blogPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-md shadow-sm">
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        <p className="text-sm text-gray-600">By {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p className="mt-2">{post.content}</p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={() => handleEdit(post)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}