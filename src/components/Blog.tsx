import { motion } from 'framer-motion';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

interface BlogPost {
    id: string; // ID sollte ein String sein, um mit Prisma übereinzustimmen
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
}

interface BlogProps {
    posts: BlogPost[];
}

export function Blog({ posts }: BlogProps) {
    return (
        <motion.section
            key="blog"
            className="h-screen flex flex-col p-8 pt-24 overflow-hidden"
        >
            <h2 className="text-3xl mb-12 text-black text-center font-light">Blog</h2>
            <div className="flex-grow relative overflow-hidden">
                <div className="absolute inset-0 overflow-y-scroll scrollbar-hide">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 pr-4">
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center cursor-none"
                            >
                                <div className="relative w-full aspect-square overflow-hidden mb-2">
                                    <Image
                                        src="/default-image.jpg" // Placeholder image
                                        alt={post.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg transition-transform duration-500 hover:scale-105"
                                    />
                                    <motion.div
                                        className="absolute bottom-2 right-2 bg-white bg-opacity-50 rounded-full p-1"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ZoomIn size={20} className="text-black" />
                                    </motion.div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-center">{post.title}</h3>
                                <p className="text-sm font-light text-gray-700 mb-2 text-center">{post.content}</p>
                                <span className="text-xs text-gray-500">By {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}