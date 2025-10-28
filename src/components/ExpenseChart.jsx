import { useMemo } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const ExpenseChart = ({ expenses, budget, type = 'category' }) => {
  const chartData = useMemo(() => {
    if (type === 'category') {
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
      ];

      return {
        labels: Object.keys(categoryTotals).map(cat => 
          cat.charAt(0).toUpperCase() + cat.slice(1)
        ),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: colors.slice(0, Object.keys(categoryTotals).length),
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      };
    }

    if (type === 'trend') {
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
      }

      const dailyTotals = last7Days.map(date => {
        const dayExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate.toDateString() === date.toDateString();
        });
        return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });

      return {
        labels: last7Days.map(date => 
          date.toLocaleDateString('en-US', { weekday: 'short' })
        ),
        datasets: [{
          label: 'Daily Spending',
          data: dailyTotals,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      };
    }
  }, [expenses, type]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'category' ? 'bottom' : 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (type === 'category') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: $${context.raw.toFixed(2)} (${percentage}%)`;
            }
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    ...(type === 'trend' && {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(0);
            }
          }
        }
      }
    })
  };

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      {type === 'category' ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default ExpenseChart;