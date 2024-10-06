"use client";
import { redirect } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import RouteClient from './(main)/_components/RouteClient';
import Welcome from './(main)/_components/Welcome';

export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const f = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`) ?? 'true';
    const firstVisit = f === 'true';
    if (!firstVisit) {
      setIsFirstVisit(false);
      redirect('/logs');
    } else {
      setIsFirstVisit(true);
    }
    setLoading(false);
  }, [])

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className='loader'></div>
    </div >
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouteClient />
      <Welcome />
    </Suspense>
  );
}
