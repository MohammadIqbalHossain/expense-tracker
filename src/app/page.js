'use client';
import { useSelector } from 'react-redux';
import LimitSetup from './components/LimitSetup';
import ExpenseForm from './components/ExpenseForm';
import ExpenseSummary from './components/ExpenseSummary';
import styles from './page.module.css';


export default function Home() {
  const limits = useSelector(state => state.limits.monthlyTotal);

  return (
    <main className={styles.main}>
      {!limits ? (
        <LimitSetup />
      ) : (
        <>
          <ExpenseForm />
          <ExpenseSummary />
        </>
      )}
    </main>
  );
}