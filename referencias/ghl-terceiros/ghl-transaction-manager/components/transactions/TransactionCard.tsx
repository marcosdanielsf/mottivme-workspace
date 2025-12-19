import { Transaction } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  transaction: Transaction;
  onClick: () => void;
}

export default function TransactionCard({ transaction, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">
            📍 {transaction.property_address || 'No address'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Status: <span className="font-medium capitalize">{transaction.status.replace('_', ' ')}</span>
          </p>
        </div>
        {transaction.deal_value && (
          <span className="text-lg font-bold text-green-600">
            ${transaction.deal_value.toLocaleString()}
          </span>
        )}
      </div>
      
      {transaction.closing_date && (
        <p className="text-sm text-gray-500 mt-2">
          Closes: {format(new Date(transaction.closing_date), 'MMM d, yyyy')}
        </p>
      )}
    </div>
  );
}