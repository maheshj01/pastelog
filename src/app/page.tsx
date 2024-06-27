"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Welcome from './(main)/_components/Welcome';
import Analytics from './(main)/_services/Analytics';

function LogsLayoutClient({ onRouteChange }: { onRouteChange: (url: string) => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    onRouteChange(pathname);
  }, [pathname, searchParams, onRouteChange]);

  return null;
}


export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleRouteChange = (url: string) => {
    console.log('route change', url);
    switch (url) {
      case '/':
        Analytics.logPageView(url, 'Welcome');
        break;
      case '/logs':
        Analytics.logPageView(url, 'New Log');
        break;
      case '/logs/[id]':
        Analytics.logPageView(url, 'individual log');
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const f = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`) ?? 'true';
    const firstVisit = f === 'true';
    if (!firstVisit) {
      setIsFirstVisit(false);
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
      <LogsLayoutClient onRouteChange={handleRouteChange} />
      <Welcome />
    </Suspense>
  );
}
