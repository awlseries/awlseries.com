import React, { useEffect } from 'react';
import './VerificationSuccess.css';

const VerificationSuccess = () => {
  useEffect(() => {
    console.log('🔵 VerificationSuccess mounted');
    console.log('🔵 Current URL:', window.location.href);
    console.log('🔵 URL Search params:', window.location.search);
    
    return () => {
      console.log('🔴 VerificationSuccess unmounted');
    };
  }, []);

  console.log('🟢 VerificationSuccess rendering');

  return (
    <div className="verification-success-page">
      <div className="verification-success-container">
        <div className="success-icon">
          <img src="/images/icons/icon-email-verified.png" alt="Email Verified" />
        </div>
        <h1 className="success-title">Email Verified!</h1>
        <p className="success-message">
          Your email has been successfully confirmed. You can now close this window.
        </p>
        <div className="success-actions">
          <button 
            className="close-btn"
            onClick={() => {
              console.log('🔵 Close button clicked');
              window.close();
            }}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;