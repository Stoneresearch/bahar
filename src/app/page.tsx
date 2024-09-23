'use client';

import { LandingPage } from '../components/landing-page';
import Image from 'next/image';

export default function Home() {
  console.log("Home component is rendering");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.gif"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
      <div className="relative z-10 w-full h-full">
        <LandingPage />
      </div>
    </div>
  );
}
