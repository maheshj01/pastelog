"use client";
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';
import Pastelog from './_components/Pastelog';

export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const visited = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`);
    if (visited) {
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
      localStorage.setItem('visited', `${isFirstVisit}`);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader" /> {/* You can replace this with a proper loading spinner */}
      </div>
    );
  }
  if (!isFirstVisit) {
    return <Pastelog />
  }
  if (isFirstVisit) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 backdrop-blur-lg"></div>
        {/* <div className="relative z-10 max-w-2xl p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">

        </div> */}
        <Button color="primary"
          size='lg'
          onClick={() => {
            setIsFirstVisit(true);
          }}
          href="/pastelog"> Get Started </Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

