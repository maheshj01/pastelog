"use client";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Home from './_components/Home';

export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const f = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`) ?? 'true';
    const firstVisit = f === 'true';
    // console.log(firstVisit, f);
    if (!firstVisit) {
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
    }
    setLoading(false);
  }, []);


  const handleGetStarted = () => {
    setIsFirstVisit(false);
    localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader" /> {/* You can replace this with a proper loading spinner */}
      </div>
    );
  }
  if (!isFirstVisit) {
    return <Home />;
  }
  if (isFirstVisit) {

    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 backdrop-blur-lg"></div>
        {/* <div className="relative z-10 max-w-2xl p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">

        </div> */}
        <Button color="primary"
          size='lg'
          onClick={handleGetStarted}> Get Started </Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Loading..</h1>
    </div>
  )
}

