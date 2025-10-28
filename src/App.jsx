import { useState, useEffect } from 'react';
import apiService from './services/api.js';
import AuthModal from './components/AuthModal.jsx';
import Dashboard from './components/Dashboard.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import BudgetSetup from './components/BudgetSetup.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import BudgetPrediction from './components/BudgetPrediction.jsx';
import ExpenseChart from './components/ExpenseChart.jsx';
import QuickActions from './components/QuickActions.jsx';
import ExpenseStats from './components/ExpenseStats.jsx';
import { Plus, Target, ChartBar as BarChart3, List, ChartPie as PieChart, Zap, LogOut, User } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
      setShowAuthModal(true);
    }
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileResponse, expensesResponse, budgetResponse] = await Promise.all([
        apiService.getProfile(),
        apiService.getExpenses({ limit: 1000 }),
        apiService.getBudget().catch(() => ({ data: { budget: null } }))
      ]);

      setUser(profileResponse.data.user);
      setExpenses(expensesResponse.data.expenses || []);
      setBudget(budgetResponse.data.budget);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load data');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (type, userData) => {
    try {
      if (type === 'login') {
        await apiService.login(userData);
      } else {
        await apiService.register(userData);
      }
      await loadUserData();
      setShowAuthModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    apiService.removeToken();
    setUser(null);
    setExpenses([]);
    setBudget(null);
    setShowAuthModal(true);
  };

  const addExpense = async (expense) => {
    try {
      console.log('Adding expense:', expense);
      const response = await apiService.createExpense(expense);
      console.log('Expense added successfully:', response);
      setExpenses(prev => [response.data.expense, ...prev]);
      if (showExpenseForm) {
        setShowExpenseForm(false);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.message || 'Failed to add expense');
      throw error; // Re-throw to handle in form
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense');
    }
  };

  const handleBudgetSetup = async (budgetData) => {
    try {
      const response = await apiService.setBudget(budgetData);
      setBudget(response.data.budget);
      setShowBudgetSetup(false);
    } catch (error) {
      console.error('Error setting budget:', error);
      setError('Failed to set budget');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'quick', label: 'Quick Add', icon: Zap },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-sm text-red-600 hover:text-red-800 underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BudgetTracker</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
              <button
                onClick={() => setShowBudgetSetup(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {budget ? 'Edit Budget' : 'Set Budget'}
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!budget && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to BudgetTracker, {user.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by setting up your monthly budget to track expenses and get predictions
            </p>
            <button
              onClick={() => setShowBudgetSetup(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set Up Budget
            </button>
          </div>
        )}

        {budget && (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <ExpenseStats expenses={expenses} budget={budget} />
                <Dashboard expenses={expenses} budget={budget} />
                <BudgetPrediction expenses={expenses} budget={budget} />
              </div>
            )}
            {activeTab === 'expenses' && (
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
                    <ExpenseChart expenses={expenses} budget={budget} type="category" />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">7-Day Spending Trend</h2>
                    <ExpenseChart expenses={expenses} budget={budget} type="trend" />
                  </div>
                </div>
                <ExpenseStats expenses={expenses} budget={budget} />
              </div>
            )}
            {activeTab === 'quick' && (
              <div className="max-w-2xl mx-auto">
                <QuickActions onAddExpense={addExpense} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm
          onAddExpense={addExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}

      {showBudgetSetup && (
        <BudgetSetup
          currentBudget={budget}
          onSetBudget={handleBudgetSetup}
          onClose={() => setShowBudgetSetup(false)}
        />
      )}
    </div>
  );
}

export default App;