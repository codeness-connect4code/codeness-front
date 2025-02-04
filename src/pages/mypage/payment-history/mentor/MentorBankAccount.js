// MentorBankAccount.jsx
import React from 'react';

const accountContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px'
};

const inputContainerStyle = {
  position: 'relative'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9fafb'
};

const changeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#3b82f6',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer'
};

const noteStyle = {
  fontSize: '14px',
  color: '#666',
  marginTop: '8px'
};

const MentorBankAccount = () => {
  return (
    <div style={accountContainerStyle}>
      <h2 style={titleStyle}>정산 계좌 관리</h2>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value="123-***-*******"
          readOnly
          style={inputStyle}
        />
        <button style={changeButtonStyle}>변경</button>
      </div>
      <p style={noteStyle}>
        * 정산받으실 계좌를 등록/변경할 수 있습니다.
      </p>
    </div>
  );
};

export default MentorBankAccount;