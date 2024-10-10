'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ZoomIn } from 'lucide-react';
import { Store } from './Store';
import { fetchBlogPosts } from '../lib/api';
import { BlogPost } from '../types';
import Link from 'next/link';

const AnimatedLink = ({ children, onClick, isActive }: { children: React.ReactNode; onClick: () => void; isActive: boolean }) => (
  <motion.span
    className={`text-sm uppercase tracking-wider ${isActive ? 'text-black' : 'text-gray-600'} hover:text-black transition-colors`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
  >
    {children}
  </motion.span>
);

const FluidBackground = () => {
  const controls = useAnimation();

  useEffect(() => {
    const animateBackground = async () => {
      await controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ["20%", "40%", "60%", "40%", "20%"],
        transition: {
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    };

    animateBackground();
  }, [controls]);

  return (
    <motion.div
      className="fixed inset-0 z-0 opacity-10 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100"
      animate={controls}
    />
  );
};

const ParallaxImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${10 * (index + 1)}%`]);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0"
      style={{ y, zIndex: -index }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        quality={100}
        priority={index === 0}
      />
    </motion.div>
  );
};

const BiographySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['-100%', '0%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-0 w-full text-6xl font-bold text-gray-200"
        style={{ x: x1, opacity }}
      >
        Visual Artist
      </motion.div>
      <motion.div
        className="absolute top-2/4 right-0 w-full text-right text-6xl font-bold text-gray-200"
        style={{ x: x2, opacity }}
      >
        Tattoo Artist
      </motion.div>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl mb-6 text-black">Bahar Şener</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm leading-relaxed space-y-4 text-gray-700"
        >
          <p>
            Bahar Şener was born in Ankara in 1991. Her art career began in 2005 when she was accepted into the Anatolian University of Fine Arts and Crafts. She graduated from the Faculty of Fine Arts at Hacettepe University with honors in 2013. After graduation, she worked in the fields of illustration and graphic design, creating visual designs for various festivals and event venues. In 2018, she transitioned to tattoo art. Currently, she is working on her painting series titled &quot;Subconscious Collage&quot;.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const pageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? "100%" : "-100%",
  }),
  in: {
    opacity: 1,
    y: 0,
  },
  out: (direction: number) => ({
    opacity: 0,
    y: direction < 0 ? "100%" : "-100%",
  }),
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

interface StoreItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const storeItems: StoreItem[] = [
  {
    id: 1,
    name: "Framed Print: Whispers of Nature",
    price: 50,
    image: "/bahar1.png"
  },
];

export function LandingPage() {
  const [currentSection, setCurrentSection] = useState('home');
  const [direction, setDirection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const images = [
    '/bahar1.png',
    '/bahar2.png',
    '/bahar3.png',
    '/bahar4.png',
    '/bahar5.png',
    '/bahar6.png',
  ];

  const works = [
    { src: '/bahar1.png', title: 'Whispers of Nature' },
    { src: '/bahar2.png', title: 'Urban Rhythms' },
    { src: '/bahar3.png', title: 'Ethereal Dreams' },
    { src: '/bahar4.png', title: 'Chromatic Harmony' },
    { src: '/bahar5.png', title: 'Temporal Echoes' },
    { src: '/bahar6.png', title: 'Soulful Portraits' },
  ];

  const handleSectionChange = (section: string) => {
    const sections = ['home', 'about', 'art', 'blog', 'store', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const newIndex = sections.indexOf(section);
    setDirection(newIndex - currentIndex);
    setCurrentSection(section);
    setMenuOpen(false);
  };

  const handleFullscreenImage = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
  };

  const handleCloseFullscreenImage = () => {
    setFullscreenImage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
  };

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      }
    };

    loadBlogPosts();
  }, []);

  if (fullscreenImage) {
    console.log("Fullscreen Image URL:", fullscreenImage);
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden font-light">
      <FluidBackground />

      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <motion.div
          className="ml-4 cursor-none hidden md:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onClick={() => handleSectionChange('home')}
        >
          <Image
            src="/logo.png"
            alt="Bahar Şener Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </motion.div>
        <nav className="hidden md:flex space-x-8 mr-4">
          <AnimatedLink onClick={() => handleSectionChange('home')} isActive={currentSection === 'home'}>Home</AnimatedLink>
          <AnimatedLink onClick={() => handleSectionChange('about')} isActive={currentSection === 'about'}>About</AnimatedLink>
          <AnimatedLink onClick={() => handleSectionChange('art')} isActive={currentSection === 'art'}>Art</AnimatedLink>
          <AnimatedLink onClick={() => handleSectionChange('blog')} isActive={currentSection === 'blog'}>Blog</AnimatedLink>
          <AnimatedLink onClick={() => handleSectionChange('store')} isActive={currentSection === 'store'}>Store</AnimatedLink>
          <AnimatedLink onClick={() => handleSectionChange('contact')} isActive={currentSection === 'contact'}>Contact</AnimatedLink>
        </nav>
        <div className="flex items-center md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-10 flex flex-col items-center justify-center md:hidden"
        >
          <nav className="flex flex-col space-y-6">
            <AnimatedLink onClick={() => handleSectionChange('home')} isActive={currentSection === 'home'}>Home</AnimatedLink>
            <AnimatedLink onClick={() => handleSectionChange('about')} isActive={currentSection === 'about'}>About</AnimatedLink>
            <AnimatedLink onClick={() => handleSectionChange('art')} isActive={currentSection === 'art'}>Art</AnimatedLink>
            <AnimatedLink onClick={() => handleSectionChange('blog')} isActive={currentSection === 'blog'}>Blog</AnimatedLink>
            <AnimatedLink onClick={() => handleSectionChange('store')} isActive={currentSection === 'store'}>Store</AnimatedLink>
            <AnimatedLink onClick={() => handleSectionChange('contact')} isActive={currentSection === 'contact'}>Contact</AnimatedLink>
          </nav>
        </motion.div>
      )}

      <main ref={mainRef} className="h-screen overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {currentSection === 'home' && (
            <motion.section
              key="home"
              className="relative h-screen flex items-center justify-center overflow-hidden"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              {images.map((src, index) => (
                <ParallaxImage key={index} src={src} alt={`Artwork ${index + 1}`} index={index} />
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white bg-opacity-70 p-4 z-10">
                <Image
                  src="/logo.png"
                  alt="Bahar Sener Logo"
                  width={120}
                  height={120}
                  className="mb-8"
                />
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-black text-center tracking-wide"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  BAHAR SENER
                </motion.h1>
                <motion.div
                  className="text-lg md:text-xl lg:text-2xl mb-4 text-gray-800 text-center font-light tracking-wide flex items-center justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <span>VISUAL ARTIST</span>
                  <span className="text-2xl md:text-3xl lg:text-4xl">·</span>
                  <span>TATTOO ARTIST</span>
                </motion.div>
                <motion.p
                  className="text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-8 text-gray-700 p-4 text-center font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Bahar Sener blends traditional art with modern techniques, creating captivating visual stories that bridge cultures and emotions. Her unique approach to design and tattooing reflects a deep passion for artistic expression and human connection.
                </motion.p>
              </div>
            </motion.section>
          )}

          {currentSection === 'about' && (
            <motion.section
              key="about"
              className="h-screen overflow-y-auto pt-24"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              <BiographySection />
            </motion.section>
          )}

          {currentSection === 'art' && (
            <motion.section
              key="art"
              className="h-screen flex flex-col p-6 pt-32 overflow-y-auto"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-8">
                {works.map(({ src, title }, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="relative w-full aspect-square overflow-hidden mb-2"
                      onClick={() => handleFullscreenImage(src)}
                    >
                      <Image
                        src={src}
                        alt={`Bahar Şener artwork: ${title}`}
                        fill
                        className="object-cover rounded-md transition-transform duration-300 hover:scale-105"
                      />
                      <motion.div
                        className="absolute bottom-2 right-2 bg-white bg-opacity-50 rounded-full p-1.5"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ZoomIn size={18} className="text-black" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-light text-gray-700 text-center">{title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {currentSection === 'blog' && (
            <motion.section
              key="blog"
              className="h-screen flex flex-col justify-start items-center p-8 pt-24 overflow-y-auto"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post) => (
                    <div key={post.id} className="p-4 border-b border-gray-200 flex flex-col">
                      <Image
                        src={post.image || '/fallback.png'} // Update the path to the correct fallback image
                        alt={post.title}
                        width={500}
                        height={300}
                        className="mb-2 w-full h-48 object-cover rounded-md"
                      />
                      <span className="text-red-500 text-xs font-bold mb-2">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Date not available'}
                      </span>
                      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                      <p className="text-gray-700 mb-4">{post.excerpt}</p>
                      <Link href={`/blog/${post.id}`} className="text-blue-500 hover:underline">Read more</Link>
                    </div>
                  ))
                ) : (
                  <p>No blog posts available.</p>
                )}
              </div>
            </motion.section>
          )}

          {currentSection === 'store' && (
            <motion.section
              key="store"
              className="h-screen flex flex-col justify-center items-center"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              <Store items={storeItems} />
            </motion.section>
          )}

          {currentSection === 'contact' && (
            <motion.section
              key="contact"
              className="h-screen flex flex-col justify-center items-center p-8 pt-24"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              custom={direction}
              transition={pageTransition}
            >
              <div className="max-w-md w-full space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center mb-6"
                >
                  <p className="text-lg font-light text-gray-800">
                    Looking to book a tattoo appointment, request a commission, or ask a question? Contact me anytime!
                  </p>
                </motion.div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="name" className="text-sm text-gray-700">Name</label>
                    <input type="text" id="name" className="border border-gray-300 rounded-md p-2" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="email" className="text-sm text-gray-700">Email</label>
                    <input type="email" id="email" className="border border-gray-300 rounded-md p-2" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="phone" className="text-sm text-gray-700">Phone</label>
                    <input type="tel" id="phone" className="border border-gray-300 rounded-md p-2" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="message" className="text-sm text-gray-700">Message</label>
                    <textarea id="message" rows={4} className="border border-gray-300 rounded-md p-2" />
                  </div>
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full">
                    Send
                  </button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {fullscreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95"
          onClick={handleCloseFullscreenImage}
        >
          <div className="relative max-w-2xl w-full h-auto" style={{ height: '80vh' }}>
            <Image
              src={fullscreenImage}
              alt="Fullscreen"
              layout="fill"
              objectFit="contain"
              onError={(e) => {
                console.error("Error loading image:", e);
                e.currentTarget.src = "/fallback-image.png"; // Fallback-Bild
              }}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-black"
            onClick={handleCloseFullscreenImage}
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>
        </motion.div>
      )}

      <footer className="fixed bottom-0 left-0 w-full p-2 bg-white bg-opacity-50 backdrop-blur-sm flex justify-between items-center">
        <p className="text-xs text-gray-600">&copy; 2023 Bahar Şener. All rights reserved.</p>
        <Link href="/admin" className="text-xs text-gray-600 hover:text-black">Admin</Link>
      </footer>
    </div>
  );
}