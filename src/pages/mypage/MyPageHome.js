// AdminMyPageHome.js
import React, { useState } from 'react';
import MyPage from './profile/MyPage';
import UserSchedule from "./schedule/UserSchedule";
import DeleteUser from "./delete-user/DeleteUser";
import MentorRequestList from "./mentor-request/MentorRequestList";
import { useHistory } from 'react-router-dom';
import ChatLayout from './chat/ChatLayout';
import MyMentoring from './my-mentoring/MyMentoring';


 const MyPageHome = () => {
 const [activeTab, setActiveTab] = useState('profile');
 const history = useHistory();

 const tabs = [
   { id: 'profile', label: '내 프로필' },
   { id: 'chatting', label: '채팅 목록' },
   { id: 'mentoring', label: '일정 목록' },
   { id: 'records', label: '거래 내역' },
   { id: 'my-mentoring', label: '내 멘토링' },
   { id: 'history', label: '멘토 신청 내역' },
   { id: 'withdraw', label: '탈퇴하기' },
 ];

 return (
   <div style={{ display: 'flex', margin: '20px' }}>
     {/* 왼쪽 탭 메뉴 */}
     <div style={{ width: '200px', marginRight: '20px' }}>
       {tabs.map(tab => (
         <div
           key={tab.id}
           onClick={() => {setActiveTab(tab.id);
            window.history.pushState(null, '', `/mypage/${tab.id}`);
           }}
           style={{
             padding: '10px',
             cursor: 'pointer',
             backgroundColor: activeTab === tab.id ? '#f0f0f0' : 'white'
           }}
         >
           {tab.label}
         </div>
       ))}
     </div>

     {/* 오른쪽 컨텐츠 영역 */}
     <div style={{
       flex: 1,
       padding: '20px',
       border: '2px solid gray',
       borderRadius: '10px'
     }}>
       {/* 각 탭에 해당하는 컴포넌트를 여기에 렌더링 */}   
       {activeTab === 'profile' && <MyPage />}
       {activeTab === 'chatting' && <ChatLayout />}
       {activeTab === 'mentoring' && <UserSchedule/>}
       {activeTab === 'my-mentoring' && <MyMentoring />}
       {activeTab === 'withdraw' && <DeleteUser/>}
       {activeTab === 'history' && <MentorRequestList/>}
       {/* ... 다른 탭들의 컨텐츠 */}
     </div>
   </div>
 );
};

export default MyPageHome;