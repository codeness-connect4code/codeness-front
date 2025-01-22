import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Switch 추가
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/auth/Login";
import PaymentPage from "./pages/payment/Payment";
import Header from "./components/header/Header"; // Header 컴포넌트 경로

//로그인 상태에서만 /payment 경로에 접근 가능하도록 보호- 추후 분리 고려해보기
// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = !!localStorage.getItem("jwtToken"); // 로그인 여부 확인
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
//       }
//     />
//   );
// };;

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/payment" component={PaymentPage} />
      </Switch>
    </Router>
  );
}

export default App;
