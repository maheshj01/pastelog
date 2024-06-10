"use client";
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GradientText from './_components/GradientText';
import Home from './_components/Home';

export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTagLine, setCurrentTagLine] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const f = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`) ?? 'true';
    const firstVisit = f === 'true';
    if (!firstVisit) {
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
    }
    setLoading(false);
  }, []);

  const tagLineWords = ['Easy', 'Fast', 'Powerful'];
  const tagLineDescription = ['Easy to use', 'Fast to load', 'Powerful features'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagLine((prev) => (prev + 1) % tagLineWords.length);
    }, 2500); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setIsFirstVisit(false);
    localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className='loader'></div>
    </div >
  }

  if (!isFirstVisit) {
    return <Home id={null} />;
  }

  if (isFirstVisit) {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        {/* bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400"> */}
        <GradientText className='tagline' text={tagLineWords[currentTagLine]} gradientColors={['#FF0080', '#7928CA']} fontSize="5rem" />
        <p className="text-2xl mb-16 text-gray-300">
          <span>Welcome to Pastelog!</span>
          { }
        </p>
        <Button color="primary" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    );
  }
}
