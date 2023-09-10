import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import NavBar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PostQuestion from "./pages/PostQuestion";
import ViewQuestion from "./pages/ViewQuestion";
import NotFound from "./pages/NotFound"
import AllQuestions from "./pages/AllQuestions";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile"
import SearchBar from "./pages/SearchBar";
import { loadUser } from "./redux/actions";

const App = () => {
  
  const dispatch = useDispatch();
  useEffect(() => { dispatch(loadUser()); }, [dispatch]);

  return (
    <div className="App" style={{backgroundColor: 'rgb(40,40,40)'}}>
      <BrowserRouter>
        <NavBar />
        <Switch>
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Home} />
        <Route path="/questions" exact component={AllQuestions} />
        <Route path="/question/ask" exact component={PostQuestion} />
        <Route path="/question/:id" exact component={ViewQuestion}/>
        <Route path="/users" exact component={Users} />
        <Route path="/users/:user_id" exact component={UserProfile} />
        <Route path="/search/:search_id" exact component={SearchBar} />
        <Route path="*" component={NotFound}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
