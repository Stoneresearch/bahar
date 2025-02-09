'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, PenSquare, Search, Settings, Users, BookOpen, Menu } from "lucide-react";
import { BlogPostEditor } from '@/components/BlogPostEditor';
import { fetchBlogPosts, deleteBlogPost, updateBlogPost, createBlogPost } from '@/lib/api';
import { BlogPost } from '@/types';

export default function AdminPage() {
    const { isSignedIn, user, isLoaded } = useUser();
    const clerk = useClerk();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteBlogPost(postId);
                await loadPosts();
                alert('Post deleted successfully');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete the post. Please try again.');
            }
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
            if (updatedPost.id) {
                await updateBlogPost(updatedPost);
            } else {
                await createBlogPost(updatedPost);
            }
            setEditingPost(null);
            await loadPosts();
        } catch (error) {
            console.error('Error updating/creating post:', error);
        }
    };

    const handleSignOut = () => {
        clerk.signOut();
        router.push('/');
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 md:w-64'} overflow-hidden`}>
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
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input type="search" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Avatar className="ring-2 ring-gray-200 transition-all duration-300 ease-in-out hover:ring-gray-400">
                            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                            <PenSquare className="w-8 h-8 mr-2 text-gray-600" />
                            Recent Posts
                        </h2>
                        <Button onClick={() => setEditingPost({ id: '', title: '', content: '', imageUrl: '', authorName: `${user?.firstName} ${user?.lastName}` })}>
                            New Post
                        </Button>
                    </div>
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
                                            <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800" onClick={() => handleEdit(post)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-800" onClick={() => handleDelete(post.id)}>
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