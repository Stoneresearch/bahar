export interface BlogPost {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    authorName: string;
    status?: string;
    excerpt?: string;
}