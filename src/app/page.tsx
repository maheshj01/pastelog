"use client";
import { redirect } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import RouteClient from './(main)/_components/RouteClient';
import Welcome from './(main)/_components/Welcome';
import useSettings from './(main)/_hooks/useSettings';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { settings, toggleNewUser, setNewUser } = useSettings();
  useEffect(() => {
    if (!settings.newUser) {
      redirect('/logs');
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
