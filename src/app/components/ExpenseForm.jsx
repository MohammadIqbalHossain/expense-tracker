'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../redux/expenseSlice';
import styles from '../styles/ExpenseForm.module.css';
import globalStyles from '../styles/global.module.css';


export default function ExpenseForm() {
  const dispatch = useDispatch();
  const [expenseFormData, setExpenseFormData] = useState({
    category: '',
    amount: '',
    purpose: '',
  });

  // Retriving data from redux store.
  const limits = useSelector((state) => state.limits.categories);
  const categoryCurrentExpenses = useSelector((state) => {
    const runningMonth = new Date().getMonth();
    return state.expenses.items.reduce((acc, exp) => {
      if (new Date(exp.date).getMonth() === runningMonth) {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      }
      return acc;
    }, {});
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = parseFloat(expenseFormData.amount);
    const currentExpenses = categoryCurrentExpenses[expenseFormData.category] || 0;

    // Setting a warning when expense is exceeding the limit amout.
    if (currentExpenses + amount > limits[expenseFormData.category]) {
      alert(
        `If you add this expense it would exceed your ${expenseFormData.category} category limit!`
      );
      return;
    }

    // Dispatcing the action for adding data.
    dispatch(addExpense({ ...expenseFormData, amount }));
    setExpenseFormData({ category: '', amount: '', purpose: '' });
  };

  return (
    <div>
        <form className={styles.expenseForm} onSubmit={handleSubmit}>
          <h2>Add New Expense</h2>
          <select
            className={globalStyles.inputField}
            value={expenseFormData.category}
            onChange={(e) =>
              setExpenseFormData({ ...expenseFormData, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Transportation">Transportation</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Utility">Utility</option>
            <option value="Charity">Charity</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>

          <input
            className={globalStyles.inputField}
            type="number"
            placeholder="Amount"
            value={expenseFormData.amount}
            onChange={(e) =>
              setExpenseFormData({ ...expenseFormData, amount: e.target.value })
            }
            required
          />

          <input
            className={globalStyles.inputField}
            type="text"
            placeholder="Purpose"
            value={expenseFormData.purpose}
            onChange={(e) =>
              setExpenseFormData({ ...expenseFormData, purpose: e.target.value })
            }
            required
          />
          
          <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}
