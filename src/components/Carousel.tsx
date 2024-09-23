import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { BlogPost } from '../types';

type CarouselItem = BlogPost;

interface CarouselProps {
    items: CarouselItem[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    if (!items || items.length === 0) {
        return <div>No items to display</div>;
    }

    const currentItem = items[currentIndex];

    if (!currentItem) {
        return <div>Error loading item</div>;
    }

    return (
        <div className="relative w-full h-full">
            <AnimatePresence initial={false} custom={currentIndex}>
                <motion.div
                    key={currentIndex}
                    custom={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="w-full h-full flex flex-col items-center justify-start p-4">
                        <h3 className="text-3xl font-semibold mb-8 mt-12">{currentItem.title || 'Untitled'}</h3>
                        {currentItem.image && (
                            <div className="relative w-full aspect-video mb-4 mt-8">
                                <Image
                                    src={currentItem.image}
                                    alt={currentItem.title || 'Blog post image'}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                        <p className="text-sm text-gray-600 mb-2 mt-4">{currentItem.excerpt || 'No excerpt available'}</p>
                        <span className="text-xs text-gray-500">{currentItem.publishedAt ? new Date(currentItem.publishedAt).toLocaleDateString() : 'No date available'}</span>
                    </div>
                </motion.div>
            </AnimatePresence>
            <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1"
                onClick={prevSlide}
            >
                <ChevronLeft size={20} />
            </button>
            <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1"
                onClick={nextSlide}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};