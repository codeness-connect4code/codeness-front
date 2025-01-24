import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatRoomList = ({ onSelectChat }) => {
 const [chatRooms, setChatRooms] = useState([]);
 const token = localStorage.getItem("jwtToken");

 useEffect(() => {
   const controller = new AbortController();

   const fetchChatRooms = async () => {
     try {
       const response = await axios.get('http://localhost:8080/chat-rooms', {
         headers: { 'Authorization': `Bearer ${token}` },
         signal: controller.signal
       });
       setChatRooms(response.data.data);
     } catch (error) {
       console.error('채팅방 목록 조회 실패:', error);
     }
   };
   fetchChatRooms();
 }, [token]);

 return (
   <div style={{ overflowY: 'auto', height: '100%'}}>
     {chatRooms.map(room => (
       <div 
         key={room.chatRoomId}
         onClick={() => {
            onSelectChat(room.chatRoomId, room.partnerId, room.partnerProfileUrl)
            setChatRooms(prevRooms => 
                prevRooms.map(prevRoom => 
                  prevRoom.chatRoomId === room.chatRoomId 
                    ? {...prevRoom, unreadCount: 0} 
                    : prevRoom
                )
              );
        }}
         style={{ padding: '10px', cursor: 'pointer', border:"1px solid black", borderRadius:"5px"}}
       >
         <img 
           src={room.partnerProfileUrl || "https://images.unsplash.com/photo-1734613876170-079f67aa0d15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D"} 
           style={{ width: 50, height: 50, borderRadius: '50%'}} 
           alt="프로필"
         />
         <div style={{
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <span style={{ color: "gray" }}>{room.partnerNick}</span>
           {room.unreadCount > 0 && (
             <span style={{
               background: '#FF4B4B',
               color: 'white',
               borderRadius: '50%',
               padding: '2px 8px',
               fontSize: '12px',
               minWidth: '20px',
               textAlign: 'center'
             }}>
               {room.unreadCount}
             </span>
           )}
         </div>
         <div>{room.lastMessage || "아직 채팅이 없습니다."}</div>
       </div>
     ))}
   </div>
 );
};

export default ChatRoomList;