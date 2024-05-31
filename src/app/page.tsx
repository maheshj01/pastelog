"use client";
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  useEffect(() => {
    const visited = localStorage.getItem('visited');
    if (visited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('visited', 'true');
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 backdrop-blur-lg"></div>
      <div className="relative z-10 max-w-2xl p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">

      </div>
      <Button color="primary"
        size='lg'
        href="/pastelog"> Get Started </Button>
    </div>
  );
}
