import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

const ExpenseStats = ({ expenses, budget }) => {
  const stats = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Previous month expenses
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
    });

    // Last 7 days
    const last7Days = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      const daysDiff = (currentDate - expenseDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const prevMonthTotal = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const last7DaysTotal = last7Days.reduce((sum, exp) => sum + exp.amount, 0);
    const last7DaysAvg = last7DaysTotal / 7;

    const monthlyChange = prevMonthTotal > 0 
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 
      : 0;

    // Most expensive category this month
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      currentMonthTotal,
      prevMonthTotal,
      monthlyChange,
      last7DaysTotal,
      last7DaysAvg,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      totalExpenses: expenses.length,
      avgExpenseAmount: expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0
    };
  }, [expenses]);

  const statCards = [
    {
      title: 'This Month',
      value: `$${stats.currentMonthTotal.toFixed(2)}`,
      change: stats.monthlyChange,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Last 7 Days',
      value: `$${stats.last7DaysTotal.toFixed(2)}`,
      subtitle: `$${stats.last7DaysAvg.toFixed(2)} daily avg`,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Top Category',
      value: stats.topCategory ? stats.topCategory.name.charAt(0).toUpperCase() + stats.topCategory.name.slice(1) : 'None',
      subtitle: stats.topCategory ? `$${stats.topCategory.amount.toFixed(2)}` : '$0.00',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Avg Expense',
      value: `$${stats.avgExpenseAmount.toFixed(2)}`,
      subtitle: `${stats.totalExpenses} total expenses`,
      icon: TrendingDown,
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="h-5 w-5" />
              </div>
              {stat.change !== undefined && (
                <div className={`flex items-center text-sm ${
                  stat.change >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseStats;