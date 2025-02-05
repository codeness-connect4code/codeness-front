// SettlementDetailModal.jsx
import React from 'react';

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const closeButtonStyle = {
  backgroundColor: '#e5e7eb',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '16px'
};

const SettlementDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '16px' }}>결제 내역 상세</h2>
        <p><strong>결제 상태:</strong> {data.paymentStatus === "COMPLETE" ? "결제 완료" : "결제 취소"}</p>
        <p><strong>멘토 닉네임:</strong> {data.userNickname}</p>
        <p><strong>멘토링 공고 제목:</strong> {data.title}</p>
        <p><strong>결제 금액:</strong> {data.paymentCost?.toLocaleString()}원</p>
        <p><strong>결제 일시:</strong> {new Date(data.createdAt).toLocaleString()}</p>
        {data.canceledAt && <p><strong>결제 취소일:</strong> {new Date(data.canceledAt).toLocaleString()}</p>}
        <p><strong>멘토링 날짜:</strong> {data.mentoringDate}</p>
        <p><strong>멘토링 시간:</strong> {data.mentoringTime}</p>
        <button style={closeButtonStyle} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SettlementDetailModal;