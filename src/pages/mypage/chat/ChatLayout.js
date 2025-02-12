
import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';

const ChatLayout = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);  // 추가
  const [profileImage, setProfileImage] = useState(null);  // 추가
  const [updateTrigger, setUpdateTrigger] = useState(0); // 추가

  const handleSelectChat = (chatId, partnerUserId, profileUrl) => {
    setSelectedChatId(chatId);
    setPartnerId(partnerUserId);
    setProfileImage(profileUrl);
    setUpdateTrigger(prev => prev+1);
    };

 return (
   <div style={{ display: 'flex', height: '600px', overflow: 'auto' }}>
     <div style={{ width: '300px', borderRight: '1px solid #ddd' }}>
       <ChatRoomList onSelectChat={handleSelectChat} activeChatId={selectedChatId} />
     </div>
     <div style={{ flex: 1 }}>
       {selectedChatId ? (
         <ChatRoom 
         key={`${selectedChatId}-${updateTrigger}`}
         chatRoomId={selectedChatId}
         partnerId={partnerId}
         profileImage={profileImage}
          />
       ) : (
         <div>채팅방을 선택해주세요</div>
       )}
     </div>
   </div>
 );
};

export default ChatLayout;