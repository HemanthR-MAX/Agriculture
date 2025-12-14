// client/src/pages/farmer/Wallet.jsx
import { useEffect, useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Download } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';

const FarmerWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchWallet();
  }, []);
  
  const fetchWallet = async () => {
    try {
      // In real implementation, this would be a dedicated wallet endpoint
      // For now, we'll fetch farmer profile which includes wallet
      const response = await api.get('/farmers/profile');
      setWallet(response.data.farmer.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      // Mock data for demo
      setWallet({
        balance: 25000,
        transactions: [
          {
            amount: 13680,
            type: 'credit',
            description: 'Balance payment for contract #ABC123',
            date: new Date('2024-12-10')
          },
          {
            amount: 3420,
            type: 'credit',
            description: 'Advance payment for contract #ABC123',
            date: new Date('2024-11-25')
          },
          {
            amount: 10000,
            type: 'debit',
            description: 'Withdrawal to bank account',
            date: new Date('2024-11-20')
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading wallet...</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>My Wallet</TranslatedText>
      </h1>
      
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-green-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-8 h-8" />
          <h2 className="text-xl">
            <TranslatedText>Available Balance</TranslatedText>
          </h2>
        </div>
        <p className="text-5xl font-bold mb-6">₹{wallet?.balance?.toLocaleString() || 0}</p>
        <button className="bg-white text-primary px-6 py-2 rounded-md hover:bg-gray-100 transition font-medium">
          <TranslatedText>Withdraw to Bank</TranslatedText>
        </button>
      </div>
      
      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          <TranslatedText>Transaction History</TranslatedText>
        </h2>
        
        {wallet?.transactions?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            <TranslatedText>No transactions yet</TranslatedText>
          </p>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map((transaction, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {transaction.type === 'credit' ? (
                      <ArrowDownCircle className="w-5 h-5 text-green-500 mt-1" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-red-500 mt-1" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(transaction.date), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {wallet?.transactions?.length > 0 && (
          <button className="mt-4 w-full text-primary hover:underline flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <TranslatedText>Download Statement</TranslatedText>
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmerWallet;
