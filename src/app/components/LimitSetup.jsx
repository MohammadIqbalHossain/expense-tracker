'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSpendingLimits } from '../redux/limitSlice';
import styles from '../styles/LimitSetup.module.css';
import { setUserId } from '../utils/storeUser';
import Button from '../ui/Button';
import globalStyles from "../styles/global.module.css";

export default function LimitSetup() {
  const dispatch = useDispatch();
  const [warning, setWarning] = useState('');

  const [limits, setLimits] = useState({
    monthlyTotal: '',
    categories: {
      Groceries: '',
      Transportation: '',
      Healthcare: '',
      Utility: '',
      Charity: '',
      Miscellaneous: ''
    }
  });

  // Loading save limits for the current user from localStorage to set as value. 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedLimits = localStorage.getItem(`limits_${userId}`);
    if (storedLimits) {
      setLimits(JSON.parse(storedLimits));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();


    const calculateCategoryLimits = Object.values(limits.categories).reduce(
      (sum, limit) => sum + (parseFloat(limit) || 0),
      0
    );

    if (calculateCategoryLimits > parseFloat(limits.monthlyTotal)) {
      setWarning('You can not add category limits more than monthly limits.');
      return;
    }
    setWarning('');

    // Check for user id in the localStorage if not exists generate new userId.
    const stroedUserId = localStorage.getItem('userId');
    const userId = stroedUserId || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    if (!stroedUserId) {
      setUserId(userId);
    }

    const limitsData = {
      ...limits,
      userId,
      date: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage with user id.
    localStorage.setItem(`limits_${userId}`, JSON.stringify(limitsData));

   
    try {
      await dispatch(setSpendingLimits(limitsData)).unwrap();
      alert('Successfully setup new limit!')
      
    } catch (error) {
      setWarning('Failed to set limits. Please try again.');
      console.error('Error setting limits:', error);
    }


  };

  // Check for limits expiration for new day. 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const storedLimits = localStorage.getItem(`limits_${userId}`);
    if (storedLimits) {
      const parsedLimits = JSON.parse(storedLimits);
      const lastUpdated = new Date(parsedLimits.lastUpdated);
      const today = new Date();
      
      //Reseting the states.
      if (lastUpdated.toDateString() !== today.toDateString()) {
        setLimits({
          monthlyTotal: '',
          categories: {
            Groceries: '',
            Transportation: '',
            Healthcare: '',
            Utility: '',
            Charity: '',
            Miscellaneous: ''
          }
        });
        localStorage.removeItem(`limits_${userId}`);
      }
    }
  }, []);

  return (
    <form className={styles.limitForm} onSubmit={handleSubmit}>
      <h2>Set Spending Limits</h2>
      <div className={styles.limits}>
        <input
          type="number"
          placeholder="Monthly Total Limit"
          value={limits.monthlyTotal}
          onChange={(e) => setLimits({...limits, monthlyTotal: parseFloat(e.target.value) || ''})}
          required
          min="0"
          step="0.01"
          className={globalStyles.inputField}
        />
      </div>

      {Object.keys(limits.categories).map(category => (
        <div key={category} className={styles.limits}>
          <label>{category}</label>
          <input
            className={globalStyles.inputField}
            type="number"
            placeholder={`${category} Limit`}
            value={limits.categories[category]}
            onChange={(e) => setLimits({
              ...limits,
              categories: {
                ...limits.categories,
                [category]: parseFloat(e.target.value) || ''
              }
            })}
            required
            min="0"
            step="0.01"
          />
        </div>
      ))}

      {warning && <p className={globalStyles.error}>{warning}</p>}

      <Button type="submit" className={styles.submitButton}>
        Set Limits
      </Button>
    </form>
  );
}