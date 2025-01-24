import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import MentorRequestList from './MentorRequest'
import MentorRequestDetail from './MentorRequestDetail';

const AdminRoutes = () => {
  return (
      <AdminLayout>
        <Switch>
          <Route exact path="/admin/mentor-request" component={MentorRequestList} />
          <Route exact path="/admin/mentor-request/:mentorId" component={MentorRequestDetail} />
          <Route exact path="/admin/mentor-list">
            <div>멘토 목록</div>
          </Route>
          <Route exact path="/admin/notice">
            <div>공지사항 관리</div>
          </Route>
          <Route exact path="/admin/settlement">
            <div>정산 내역 관리</div>
          </Route>
          <Redirect to="/admin/mentor-request" />
        </Switch>
      </AdminLayout>
  );
};

export default AdminRoutes;
