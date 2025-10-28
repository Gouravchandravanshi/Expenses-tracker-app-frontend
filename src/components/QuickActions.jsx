import { useState } from 'react';
import { Coffee, Car, Hop as Home, ShoppingBag, Gamepad2, Plus } from 'lucide-react';

const QuickActions = ({ onAddExpense }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickExpenses = [
    { icon: Coffee, label: 'Coffee', amount: 5.50, category: 'food' },
    { icon: Car, label: 'Gas', amount: 40.00, category: 'transportation' },
    { icon: Home, label: 'Groceries', amount: 75.00, category: 'food' },
    { icon: ShoppingBag, label: 'Shopping', amount: 25.00, category: 'shopping' },
    { icon: Gamepad2, label: 'Entertainment', amount: 15.00, category: 'entertainment' },
  ];

  const handleQuickAdd = async (expense) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const expenseData = {
        description: expense.label,
        amount: expense.amount,
        category: expense.category,
        date: new Date().toISOString(),
        isRecurring: false,
        recurringFrequency: null,
        nextRecurringDate: null
      };
      
      console.log('Quick adding expense:', expenseData);
      await onAddExpense(expenseData);
      console.log('Quick add successful');
    } catch (error) {
      console.error('Quick add error:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAdd = async () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (loading) return;
    setLoading(true);
    
    try {
      const expenseData = {
        description: 'Quick expense',
        amount: parseFloat(customAmount),
        category: 'other',
        date: new Date().toISOString(),
        isRecurring: false,
        recurringFrequency: null,
        nextRecurringDate: null
      };
      
      console.log('Custom adding expense:', expenseData);
      await onAddExpense(expenseData);
      setCustomAmount('');
      setShowCustom(false);
      console.log('Custom add successful');
    } catch (error) {
      console.error('Custom add error:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Expenses</h3>
      <p className="text-sm text-gray-600 mb-6">Add common expenses with one click</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {quickExpenses.map((expense, index) => {
          const Icon = expense.icon;
          return (
            <button
              key={index}
              onClick={() => handleQuickAdd(expense)}
              disabled={loading}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-blue-200"
            >
              <Icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 mb-1">
                {expense.label}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-blue-500 font-semibold">
                ${expense.amount.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Amount</h4>
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Add Custom Amount</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 12.50)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleCustomAdd}
                disabled={loading || !customAmount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
            <button
              onClick={() => {
                setShowCustom(false);
                setCustomAmount('');
              }}
              disabled={loading}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-600">Adding expense...</span>
        </div>
      )}
    </div>
  );
};

export default QuickActions;