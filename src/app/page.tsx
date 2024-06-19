"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Welcome from './(main)/_components/Welcome';

export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className='loader'></div>
    </div >
  }

  if (!isFirstVisit) {
    router.push('/logs');
  } else {
    return (
      <Welcome />
    );
  }
}
