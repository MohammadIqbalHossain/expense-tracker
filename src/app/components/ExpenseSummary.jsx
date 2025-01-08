'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../redux/expenseSlice';
import { deleteExpense } from '../redux/expenseDeleteSlice';
import styles from '../styles/ExpenseSummary.module.css';
import globalStyles from '../styles/global.module.css';
import Button from '../ui/Button';

export default function ExpenseSummary() {
  const dispatch = useDispatch();
  
  const expenses = useSelector(state => state.expenses.items);
  const expenseStatus = useSelector(state => state.expenses.status);
  const expenseError = useSelector(state => state.expenses.error);
  const deleteStatus = useSelector(state => state.deleteExpense.status);
  const deleteError = useSelector(state => state.deleteExpense.error);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const groupByDate = () => {
    const grouped = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(expense);
    });
    return grouped;
  };



  const handleDelete = async (expenseId) => {
    try {
      alert('Are you sure? You"re deleting thise expense record!')
      await dispatch(deleteExpense(expenseId)).unwrap();
    } catch (error) {
      console.error('Delete expense failed:', error);
    }
  };

  if (expenseStatus === 'loading') return <div className={globalStyles.loading}>Loading...</div>;
  if (expenseStatus === 'failed') return <div className={globalStyles.error}>Error: {expenseError}</div>;

  const groupedExpenses = groupByDate();

  return (
    <div className={styles.summaryContainer}>
      <h2>Expense Summary</h2>
      
      {/* Handling errors for delete */}
      {deleteStatus === 'failed' && (
        <div className={globalStyles.error}>
          Error deleting expense: {deleteError}
        </div>
      )}

      {Object.entries(groupedExpenses).map(([date, todayExpenses]) => (
        <div key={date} className={styles.groupByday}>
          <h3>{date}</h3>
          <div className={styles.expenses}>
            {todayExpenses.map((expense) => (
              <div 
                key={expense._id} 
                className={styles.expense}
                title={`Purpose: ${expense.purpose}`}
              >
                 <Button 
                  type='danger'
                  onClick={() => handleDelete(expense._id)}
                  disabled={deleteStatus === 'loading'}
                >
                  {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
                </Button>
                <span>{expense.category}</span>
                <span>${expense.amount.toFixed(2)}</span>
               
              </div>
            ))}
            <div className={styles.totalForDay}>
              Total: ${todayExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}