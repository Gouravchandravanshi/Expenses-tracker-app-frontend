import { useState } from 'react';
import { X, Target } from 'lucide-react';

const BudgetSetup = ({ currentBudget, onSetBudget, onClose }) => {
  const [budgetAmount, setBudgetAmount] = useState(
    currentBudget ? currentBudget.amount.toString() : ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (budgetAmount && parseFloat(budgetAmount) > 0) {
      onSetBudget({
        amount: parseFloat(budgetAmount),
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentBudget ? 'Edit Monthly Budget' : 'Set Monthly Budget'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600">
              Set your monthly budget to track expenses and get spending predictions
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="budget"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="1500.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This will be your spending limit for each month
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentBudget ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetup;