// src/pages/chat/ChatRoom.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatRoomList from './ChatRoomList';

const ChatRoom = ({ chatRoomId, partnerId, profileImage}) => {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("jwtToken");
    // 새로운 상태 추가
    const [newMessage, setNewMessage] = useState('');

    // 메시지 전송 함수 추가
    const sendMessage = async () => {
        try {
        await axios.post('http://localhost:8080/chat-rooms/chat', {
            "firebaseChatRoomId": chatRoomId,
            "message": newMessage
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setNewMessage('');
        // 메시지 전송 후 목록 새로고침
        const response = await axios.get(`http://localhost:8080/chat-rooms/${chatRoomId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setMessages(response.data.data);
        } catch (error) {
        console.error('메시지 전송 실패:', error);
        }
    };

    useEffect(() => {
    const fetchMessages = async () => {
        try {
        const response = await axios.get(`http://localhost:8080/chat-rooms/${chatRoomId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setMessages(response.data.data);
        } catch (error) {
        console.error('메시지 조회 실패:', error);
        }
    };
   fetchMessages();
 }, [chatRoomId]);

 return (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      {messages.map(msg => (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: msg.senderId !== partnerId ? 'flex-end' : 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {msg.senderId === partnerId && (
              <img 
                src={profileImage || "https://images.unsplash.com/photo-1734613876170-079f67aa0d15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D"} 
                style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} 
                alt="프로필"
              />
            )}
            <div style={{
              background: msg.senderId === partnerId ? '#E9ECEF' : '#007AFF',
              color: msg.senderId === partnerId ? 'black' : 'white',
              padding: '10px',
              borderRadius: '10px',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </div>
          </div>
          <div style={{ 
            fontSize: '12px',
            color: '#999',
            marginTop: '5px',
            marginLeft: msg.senderId === partnerId ? '38px' : '0'
          }}>
            {msg.timestamp}
          </div>
        </div>
      ))}
    </div>
<div style={{ 
 display: 'flex', 
 padding: '10px',
 borderTop: '1px solid #ddd',
 gap: '10px'
}}>
 <input
   type="text"
   value={newMessage}
   onChange={(e) => setNewMessage(e.target.value)}
   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
   style={{
     flex: 1,
     padding: '10px',
     borderRadius: '5px',
     border: '1px solid #ddd'
   }}
   placeholder="메시지를 입력하세요"
 />
 <button
   onClick={sendMessage}
   style={{
     padding: '10px 20px',
     borderRadius: '5px',
     border: 'none',
     backgroundColor: '#007AFF',
     color: 'white',
     cursor: 'pointer'
   }}
 >
   전송
 </button>
</div>
  </div>
 );
};

export default ChatRoom;