import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types'; // Import the BlogPost type

interface BlogPostEditorProps {
    onSubmit: (post: BlogPost) => void; // Changed to accept BlogPost
    onCancel: () => void;
    authorName: string;
    initialData?: BlogPost; // Changed to BlogPost
}

export const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ onSubmit, onCancel, authorName, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [authorNameState, setAuthorName] = useState(initialData?.authorName || authorName);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setAuthorName(initialData.authorName);
        }
    }, [initialData]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageUrl = initialData?.imageUrl || '';

        if (selectedImage) {
            // Upload image to your backend or directly to a cloud service
            const formData = new FormData();
            formData.append('file', selectedImage);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            imageUrl = data.url; // Assume your backend returns the URL of the uploaded image
        }

        onSubmit({ title, content, imageUrl, authorName: authorNameState });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="image">Image</label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageSelect}
                />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                >
                    {initialData ? 'Update' : 'Publish'}
                </button>
            </div>
        </form>
    );
};
