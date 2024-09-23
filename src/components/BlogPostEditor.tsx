import React, { useState, useEffect } from 'react';

interface BlogPostEditorProps {
    onSubmit: (post: { title: string; content: string; imageFile?: File; authorName: string }) => void;
    onCancel: () => void;
    authorName: string;
    initialData?: { title: string; content: string; authorName: string };
}

export const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ onSubmit, onCancel, authorName, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [authorNameState, setAuthorName] = useState(initialData?.authorName || authorName);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setAuthorName(initialData.authorName);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, content, imageFile: imageFile || undefined, authorName: authorNameState });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl mb-4 font-light">{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                        Author
                    </label>
                    <input
                        type="text"
                        id="authorName"
                        value={authorNameState}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mt-1 block w-full"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                    >
                        {initialData ? 'Update' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    );
};