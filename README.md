# BudgetTracker - Smart Expense Management App

A comprehensive budget tracking application with intelligent expense prediction capabilities. Track your spending, set budgets, and get real-time predictions about when you might exceed your budget limits.

![BudgetTracker Preview](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop)

## 🚀 Features

### Core Features
- **Smart Budget Prediction**: Get intelligent forecasts like "At this rate, you will exceed your budget by the 20th of the month"
- **Expense Tracking**: Add, categorize, and manage all your expenses
- **Real-time Dashboard**: Visual overview of your spending with progress indicators
- **Category Management**: Organize expenses into predefined categories (Food, Transportation, Utilities, etc.)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Advanced Features
- **Quick Add Actions**: One-click expense entry for common purchases
- **Recurring Expenses**: Track monthly, weekly, or yearly recurring expenses
- **Visual Analytics**: Interactive charts showing spending patterns and trends
- **Expense Statistics**: Detailed insights including monthly comparisons and category breakdowns
- **Budget Progress Tracking**: Visual progress bars with color-coded alerts
- **Search & Filter**: Find specific expenses with powerful filtering options

### Smart Predictions
- **Daily Spending Analysis**: Calculates your daily average spending
- **Budget Overflow Prediction**: Predicts exact dates when you might exceed your budget
- **Spending Recommendations**: Provides actionable advice to stay within budget
- **Trend Analysis**: 7-day spending trends with visual charts

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Chart.js & React-ChartJS-2** - Interactive charts and data visualization
- **Lucide React** - Beautiful, customizable icons

### Backend (Ready for Implementation)
- **Node.js & Express.js** - RESTful API server
- **MongoDB & Mongoose** - Database and ODM
- **JWT Authentication** - Secure user authentication
- **Bcrypt** - Password hashing and security
- **Express Validator** - Input validation and sanitization

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-tracker
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Setup Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env file with your MongoDB URI and JWT secret
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in server/.env
   ```

6. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

7. **Start the Frontend (in new terminal)**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

**Backend:**
- `cd server && npm run dev` - Start backend development server
- `cd server && npm start` - Start backend production server

## 🔧 Backend API

The backend provides a complete RESTful API with the following endpoints:

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Expenses (`/api/expenses`)
- `GET /` - Get all expenses (with pagination & filters)
- `POST /` - Create new expense
- `GET /stats` - Get expense statistics
- `GET /:id` - Get specific expense
- `PUT /:id` - Update expense
- `DELETE /:id` - Delete expense

### Budget (`/api/budget`)
- `GET /` - Get current budget
- `POST /` - Set/update budget
- `GET /analysis` - Get budget analysis & predictions

### Example API Usage
```javascript
// Register user
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

// Create expense (with auth token)
const expenseResponse = await fetch('http://localhost:5000/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    description: 'Lunch',
    amount: 25.50,
    category: 'food'
  })
});
```

## 🎯 How to Use

### Getting Started
1. **Set Your Budget**: Click "Set Budget" to establish your monthly spending limit
2. **Add Expenses**: Use the "Add Expense" button or Quick Add features
3. **Monitor Progress**: View your dashboard for real-time budget tracking
4. **Get Predictions**: Check the prediction section for spending forecasts

### Adding Expenses
- **Manual Entry**: Fill out the expense form with description, amount, and category
- **Quick Add**: Use predefined buttons for common expenses (coffee, gas, groceries)
- **Recurring Expenses**: Mark expenses as recurring for automatic tracking

### Understanding Predictions
The app analyzes your spending patterns and provides:
- **Daily Average**: Your average daily spending
- **Projection**: Estimated total monthly spending
- **Alert Dates**: When you might exceed your budget
- **Recommendations**: Tips to stay within budget

## 📊 Features Breakdown

### Dashboard
- Monthly budget overview
- Total spent vs. remaining budget
- Budget progress with color-coded indicators
- Top spending categories
- Recent expense list

### Analytics
- **Category Charts**: Doughnut chart showing spending distribution
- **Trend Analysis**: Line chart of 7-day spending patterns
- **Statistics Cards**: Key metrics and comparisons
- **Monthly Comparisons**: Current vs. previous month analysis

### Expense Management
- **Search & Filter**: Find expenses by description or category
- **Category Organization**: Color-coded expense categories
- **Bulk Actions**: Delete multiple expenses
- **Detailed View**: Complete expense history with timestamps

## 🔧 Customization

### Adding New Categories
Edit the `categories` array in `ExpenseForm.jsx`:
```javascript
const categories = [
  'food',
  'transportation',
  'utilities',
  'entertainment',
  'healthcare',
  'shopping',
  'education',
  'your-new-category', // Add here
  'other'
];
```

### Modifying Quick Actions
Update the `quickExpenses` array in `QuickActions.jsx`:
```javascript
const quickExpenses = [
  { icon: YourIcon, label: 'Your Label', amount: 10.00, category: 'your-category' },
  // Add more quick actions
];
```

## 🚀 Future Enhancements

### Planned Features
- **Real-time Notifications**: Push notifications for budget alerts
- **Advanced Analytics**: Machine learning predictions
- **Multi-user Support**: Family and team budget sharing
- **Receipt Scanning**: OCR for automatic expense entry
- **Bill Reminders**: Notifications for upcoming bills
- **Export Features**: PDF and CSV export capabilities
- **Multi-Currency**: Support for different currencies
- **Investment Tracking**: Track savings and investments
- **Debt Management**: Debt payoff planning tools

### Technical Improvements
- **PWA Support**: Offline functionality
- **Dark Mode**: Theme switching
- **Accessibility**: Enhanced screen reader support
- **Performance**: Code splitting and lazy loading
- **Testing**: Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🗃️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  budget: {
    amount: Number,
    createdAt: Date,
    updatedAt: Date
  },
  preferences: {
    currency: String,
    theme: String,
    notifications: Boolean
  }
}
```

### Expense Model
```javascript
{
  user: ObjectId,
  description: String,
  amount: Number,
  category: String,
  date: Date,
  isRecurring: Boolean,
  recurringFrequency: String,
  tags: [String],
  notes: String
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include screenshots and error messages when applicable

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualization
- **Tailwind CSS** for rapid UI development
- **Lucide** for the comprehensive icon library
- **Vite** for the excellent development experience
- **React** team for the amazing framework

---

**Made with ❤️ for better financial management**

Start tracking your expenses today and take control of your financial future!