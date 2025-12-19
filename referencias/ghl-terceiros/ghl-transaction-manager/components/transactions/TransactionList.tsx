'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/types';
import TransactionCard from './TransactionCard';
import { supabase } from '@/lib/supabase';

interface Props {
  userId: string;
  locationId: string;
}

export default function TransactionList({ userId, locationId }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadTransactions();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `ghl_user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🆕 New transaction!', payload.new);
          setTransactions(prev => [payload.new as Transaction, ...prev]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  async function loadTransactions() {
    setLoading(true);
    const response = await fetch(
      `/api/transactions?userId=${userId}&locationId=${locationId}`
    );
    const data = await response.json();
    setTransactions(data);
    setLoading(false);
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Transactions ({transactions.length})
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Create New
        </button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-2">No transactions yet.</p>
          <p className="text-sm text-gray-500">
            Move an opportunity to "Under Contract" in GHL to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(txn => (
            <TransactionCard
              key={txn.id}
              transaction={txn}
              onClick={() => alert(`View transaction: ${txn.property_address}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}