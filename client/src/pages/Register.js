import React from "react";
import AuthCard from "../components/AuthCard";
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/svg/StackOverflow";
import Alert from "../components/Alert";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const Register = () => {
  window.scrollTo(0, 0);
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector(state => state.loading.loading)

  if (isAuthenticated) history.push("/");

  return (
    <React.Fragment>
      <Alert />
	    {loading && <Spinner />}
      {!loading && 
        <div className="flex flex-col justify-center items-center h-screen">
        <a href="/"><Logo /></a>
        <AuthCard type="Sign up" />
        <span style={{color:'white'}}>Already have an account?<Link to="/login"><span className="text-blue-500"> Login</span></Link></span>
        </div>
      }
    </React.Fragment>
  );
};
export default Register;
