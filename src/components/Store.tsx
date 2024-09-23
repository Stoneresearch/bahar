import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface StoreItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface StoreProps {
    items: StoreItem[];
}

export const Store: React.FC<StoreProps> = ({ items }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">${item.price}</p>
                    <button className="bg-black text-white px-4 py-2 rounded-full flex items-center justify-center w-full">
                        <ShoppingBag className="mr-2" size={16} />
                        Add to Cart
                    </button>
                </motion.div>
            ))}
        </div>
    );
};