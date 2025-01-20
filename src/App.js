import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Switch 추가
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/Login/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default App;
