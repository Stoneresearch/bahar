'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BlogPostEditor } from '../../components/BlogPostEditor';

export default function AdminPage() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            const userRole = user.publicMetadata.role;
            console.log('User Role:', userRole); // Debugging
            setIsAdmin(userRole === 'admin');
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (!isLoaded) return;
        console.log('isSignedIn:', isSignedIn); // Debugging
        console.log('isAdmin:', isAdmin); // Debugging
        if (!isSignedIn) {
            redirect('/sign-in');
        } else if (!isAdmin) {
            redirect('/');
        }
    }, [isLoaded, isSignedIn, isAdmin]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Area</h1>
            <BlogPostEditor
                onSubmit={(post) => console.log('Submitted post:', post)}
                onCancel={() => console.log('Cancelled')}
                authorName={`${user?.firstName} ${user?.lastName}`}
            />
        </div>
    );
}
