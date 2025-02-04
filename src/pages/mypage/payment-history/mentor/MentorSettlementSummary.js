// MentorSettlementSummary.jsx
import React from 'react';

const summaryContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px'
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const labelStyle = {
  color: '#666'
};

const finalAmountStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #eee',
  paddingTop: '8px',
  marginTop: '8px'
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  marginTop: '16px',
  cursor: 'pointer'
};

const MentorSettlementSummary = () => {
  const summaryData = {
    totalCount: 12,
    totalAmount: 600000,
    commission: 24000,
    finalAmount: 576000
  };

  return (
    <div style={summaryContainerStyle}>
      <h2 style={titleStyle}>이번 달 정산내역</h2>
      <div style={itemStyle}>
        <span style={labelStyle}>총 건수</span>
        <span>{summaryData.totalCount}건</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>총 정산액</span>
        <span>{summaryData.totalAmount.toLocaleString()}원</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>중계 수수료</span>
        <span>{summaryData.commission.toLocaleString()}원</span>
      </div>
      <div style={finalAmountStyle}>
        <span>최종 정산금액</span>
        <span>{summaryData.finalAmount.toLocaleString()}원</span>
      </div>
      <button style={buttonStyle}>정산 받기</button>
    </div>
  );
};

export default MentorSettlementSummary;