import { useMemo } from 'react';
import { TriangleAlert as AlertTriangle, TrendingUp, Calendar, Target } from 'lucide-react';

const BudgetPrediction = ({ expenses, budget }) => {
  const prediction = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    // Get expenses for current month
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    if (monthlyExpenses.length === 0) {
      return {
        canPredict: false,
        message: "Add some expenses to get budget predictions"
      };
    }

    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyAverage = totalSpent / currentDay;
    
    // Days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Projected spending for the entire month
    const projectedMonthlySpending = dailyAverage * daysInMonth;
    
    // When will budget be exceeded (if at all)
    const daysToExceed = budget.amount / dailyAverage;
    const exceedDate = new Date(currentYear, currentMonth, Math.ceil(daysToExceed));
    
    const remaining = budget.amount - totalSpent;
    const daysRemaining = daysInMonth - currentDay;
    const dailyBudgetRemaining = remaining / daysRemaining;

    return {
      canPredict: true,
      totalSpent,
      dailyAverage,
      projectedMonthlySpending,
      willExceedBudget: projectedMonthlySpending > budget.amount,
      exceedDate,
      daysToExceed,
      remaining,
      dailyBudgetRemaining,
      daysInMonth,
      currentDay,
      spendingTrend: dailyAverage > (budget.amount / daysInMonth) ? 'high' : 'low'
    };
  }, [expenses, budget]);

  if (!prediction.canPredict) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Budget Prediction</h2>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{prediction.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        prediction.willExceedBudget 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${
            prediction.willExceedBudget ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {prediction.willExceedBudget ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : (
              <Target className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className={`text-lg font-semibold mb-2 ${
              prediction.willExceedBudget ? 'text-red-900' : 'text-green-900'
            }`}>
              Budget Prediction
            </h2>
            
            {prediction.willExceedBudget ? (
              <div className="space-y-2">
                <p className="text-red-800 font-medium">
                  ⚠️ At this rate, you will exceed your budget by the{' '}
                  <span className="font-bold">
                    {prediction.exceedDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
                <p className="text-red-700">
                  Projected monthly spending: <span className="font-semibold">
                    ${prediction.projectedMonthlySpending.toFixed(2)}
                  </span> (${(prediction.projectedMonthlySpending - budget.amount).toFixed(2)} over budget)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-green-800 font-medium">
                  ✅ Great job! You're on track to stay within your budget
                </p>
                <p className="text-green-700">
                  Projected monthly spending: <span className="font-semibold">
                    ${prediction.projectedMonthlySpending.toFixed(2)}
                  </span> (${(budget.amount - prediction.projectedMonthlySpending).toFixed(2)} under budget)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Daily Average</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            ${prediction.dailyAverage.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Per day this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Days Remaining</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {prediction.daysInMonth - prediction.currentDay}
          </p>
          <p className="text-xs text-gray-500">Until month end</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Daily Budget Left</span>
          </div>
          <p className={`text-xl font-bold ${
            prediction.dailyBudgetRemaining > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${Math.abs(prediction.dailyBudgetRemaining).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {prediction.dailyBudgetRemaining > 0 ? 'Available per day' : 'Over daily limit'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-4 h-4 rounded-full ${
              prediction.spendingTrend === 'high' ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-600">Spending Trend</span>
          </div>
          <p className={`text-xl font-bold ${
            prediction.spendingTrend === 'high' ? 'text-red-600' : 'text-green-600'
          }`}>
            {prediction.spendingTrend === 'high' ? 'High' : 'Good'}
          </p>
          <p className="text-xs text-gray-500">Compared to budget</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {prediction.willExceedBudget ? (
            <>
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">
                  <span className="font-medium">Reduce daily spending:</span> Try to spend only 
                  ${prediction.dailyBudgetRemaining > 0 ? prediction.dailyBudgetRemaining.toFixed(2) : '0.00'} 
                  per day for the rest of the month
                </p>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Review expenses:</span> Look for non-essential purchases you can postpone
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-green-800">
                  <span className="font-medium">Stay on track:</span> You can spend up to 
                  ${prediction.dailyBudgetRemaining.toFixed(2)} per day and still meet your budget
                </p>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-purple-800">
                  <span className="font-medium">Consider saving:</span> You might be able to put aside some money for next month
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetPrediction;