export interface BlogPost {
    id: number;
    title: string;
    excerpt?: string;
    content: string;
    publishedAt?: string;
    image?: string;
    imageFile?: File;
    author: string; // New field for author
}