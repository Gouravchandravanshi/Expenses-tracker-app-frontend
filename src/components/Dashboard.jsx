import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, TriangleAlert as AlertTriangle } from 'lucide-react';

const Dashboard = ({ expenses, budget }) => {
  const dashboardData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget.amount - totalSpent;
    const spentPercentage = (totalSpent / budget.amount) * 100;

    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalSpent,
      remaining,
      spentPercentage: Math.min(spentPercentage, 100),
      monthlyExpenses,
      topCategories
    };
  }, [expenses, budget]);

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900">${budget.amount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardData.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData.spentPercentage.toFixed(1)}% of budget
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${dashboardData.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(dashboardData.remaining).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData.remaining >= 0 ? 'Within budget' : 'Over budget'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${dashboardData.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {dashboardData.remaining >= 0 ? (
                <TrendingDown className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budget Progress</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dashboardData.spentPercentage)}`}>
            {dashboardData.spentPercentage.toFixed(1)}% Used
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(dashboardData.spentPercentage)}`}
            style={{ width: `${Math.min(dashboardData.spentPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>$0</span>
          <span>${budget.amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Top Spending Categories */}
      {dashboardData.topCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h2>
          <div className="space-y-4">
            {dashboardData.topCategories.map(([category, amount]) => {
              const percentage = (amount / dashboardData.totalSpent) * 100;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                      <span className="text-sm text-gray-600">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      {dashboardData.monthlyExpenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {dashboardData.monthlyExpenses.slice(0, 5).map((expense) => (
              <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500 capitalize">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.createdAt || expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;