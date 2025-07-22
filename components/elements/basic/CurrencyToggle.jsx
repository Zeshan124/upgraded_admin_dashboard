import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCurrency } from '~/store/currency/action';
const CurrencyToggle = ({ currencies = ['PKR', 'USD'] }) => {
  const dispatch = useDispatch();
  const { selectedCurrency, loading } = useSelector(state => state.currency);

  const handleToggle = () => {
    dispatch(toggleCurrency());
  };

  return (
    <div className="currency-toggle-container">
      <div className="currency-toggle">
        {currencies.map((currency) => (
          <button
            key={currency}
            className={`currency-btn ${selectedCurrency === currency ? 'active' : ''}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {currency}
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="exchange-rate-display">
          <small>Loading rates...</small>
        </div>
      )}
    </div>
  );
};
export default CurrencyToggle;