'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TransactionList from '@/components/transactions/TransactionList';
import { GHLContext } from '@/lib/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const [context, setContext] = useState<GHLContext | null>(null);
  
  useEffect(() => {
    // Get GHL context from URL params
    const locationId = searchParams.get('location_id');
    const userId = searchParams.get('user_id');
    const companyId = searchParams.get('company_id');
    
    if (locationId && userId) {
      setContext({ locationId, userId, companyId: companyId || undefined });
    }
  }, [searchParams]);
  
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Transaction Manager</h1>
          <p className="text-gray-600">
            This app should be loaded from within Go High Level.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Missing location_id or user_id parameters.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <TransactionList 
        userId={context.userId}
        locationId={context.locationId}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}