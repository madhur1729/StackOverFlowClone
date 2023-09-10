import React from "react";
import AuthCard from "../components/AuthCard";
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/svg/StackOverflow";
import Alert from "../components/Alert";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const Login = () => {
	window.scrollTo(0, 0);
  	const history = useHistory();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const loading = useSelector(state => state.loading.loading);

	if (isAuthenticated) history.push("/");

	return (
		<React.Fragment>
			<Alert />
			{loading && <Spinner />}
			{!loading && 
				<div className="flex flex-col justify-center items-center h-screen">
				<a href="/"><Logo /></a>
				<AuthCard type="Log in" />
				<span style={{color:'white'}}>Don’t have an account?<Link to="/register"><span className="text-blue-500"> Sign up</span></Link></span>
			    </div>
			}
		</React.Fragment>
	);
};

export default Login;