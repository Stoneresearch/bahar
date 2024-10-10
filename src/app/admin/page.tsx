'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, PenSquare, Search, Settings, Users, BookOpen } from "lucide-react";
import { BlogPostEditor } from '@/components/BlogPostEditor';
import { fetchBlogPosts, deleteBlogPost, updateBlogPost } from '@/lib/api';
import { BlogPost } from '@/types';

export default function AdminPage() {
    const { isSignedIn, user, isLoaded } = useUser();
    const clerk = useClerk();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (isLoaded && user) {
                const userRole = user.publicMetadata.role;
                console.log('User Role:', userRole);
                const isUserAdmin = userRole === 'admin';
                setIsAdmin(isUserAdmin);
                setIsLoading(false);

                if (!isUserAdmin) {
                    router.push('/');
                } else {
                    await loadPosts();
                }
            } else if (isLoaded && !isSignedIn) {
                router.push('/sign-in');
            }
        };

        checkAdminStatus();
    }, [isLoaded, user, isSignedIn, router]);

    const loadPosts = async () => {
        try {
            const data = await fetchBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            const token = await clerk.session?.getToken();
            if (!token) throw new Error('No authentication token available');
            await deleteBlogPost(postId, token);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    const handleSubmitEdit = async (updatedPost: BlogPost) => {
        try {
            const token = await clerk.session?.getToken();
            if (!token) throw new Error('No authentication token available');
            await updateBlogPost(updatedPost, token);
            setEditingPost(null);
            await loadPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return null; // This will prevent any flash of content before redirect
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white rounded-r-2xl shadow-lg transition-all duration-300 ease-in-out hover:w-72">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <BookOpen className="w-8 h-8 mr-2 text-gray-600" />
                        Blog Post Admin
                    </h1>
                </div>
                <nav className="mt-6">
                    {[
                        { icon: PenSquare, label: "Posts", active: true },
                        { icon: Users, label: "Users" },
                        { icon: Settings, label: "Settings" },
                    ].map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className={`flex items-center px-6 py-3 text-gray-700 transition-colors duration-200 ease-in-out ${item.active
                                ? "bg-gray-200 text-gray-900"
                                : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white rounded-b-2xl shadow-md">
                    <div className="flex items-center w-1/3 bg-gray-100 rounded-full overflow-hidden transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-gray-300">
                        <Search className="w-5 h-5 text-gray-500 ml-3" />
                        <Input type="search" placeholder="Search..." className="border-none bg-transparent focus:outline-none" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Avatar className="ring-2 ring-gray-200 transition-all duration-300 ease-in-out hover:ring-gray-400">
                            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full" onClick={() => router.push('/sign-out')}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <PenSquare className="w-8 h-8 mr-2 text-gray-600" />
                        Recent Posts
                    </h2>
                    {editingPost ? (
                        <BlogPostEditor
                            initialData={editingPost}
                            onSubmit={handleSubmitEdit}
                            onCancel={handleCancelEdit}
                            authorName={`${user?.firstName} ${user?.lastName}`}
                        />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-4px]">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {post.excerpt || post.content.substring(0, 100)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">{post.status || 'Draft'}</Badge>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200 ease-in-out" onClick={() => handleEdit(post)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-800 transition-colors duration-200 ease-in-out" onClick={() => handleDelete(post.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}