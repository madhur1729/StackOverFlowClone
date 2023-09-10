import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAlert, setLoadingAction, stopLoadingAction, register, login } from "../redux/actions";


const AuthCard = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  function submit(event) {
    event.preventDefault();

    if (props.type === "Sign up" && name === "") {
      dispatch(setAlert({ message: "Name is too short", status: false }));
      return;
    } 
    else if (!email.includes("@")) {
      dispatch(setAlert({ message: "Invalid Email", status: false }));
      return;
    } 
    else if (password.length < 6) {
      dispatch(setAlert({ message: "Password must be of minimum 6 characters", status: false }));
      return;
    }
    if (props.type === "Log in") {
      dispatch(setLoadingAction());
      dispatch(login({ email, password }));
      dispatch(stopLoadingAction());
    } 
    else {
      dispatch(setLoadingAction());
      dispatch(register({ name, email, password }));
      dispatch(stopLoadingAction());
    }
  }

  const setNameChange = (e) => { setName(e.target.value); };
  const setEmailChange = (e) => { setEmail(e.target.value); };
  const setPasswordChange = (e) => { setPassword(e.target.value); };

  const location = useLocation();

  return (
    <form>
      <div className="flex flex-col rounded w-96 px-5 bg-black py-10 m-10" 
      style={{ boxShadow: "0 10px 25px rgb(0,0,0,5%), 0 20px 48px rgb(0,0,0,5%), 0 1px 4px rgb(0,0,0,10%)" }}>
        {location.pathname === "/register" && ( <label className="text-left ml-2 mt-1 font-medium font-sans BlinkMacSystemFont" style={{color:'white'}}>Username</label> )}
        {location.pathname === "/register" && ( <input id="displayName" type="text" required
            className="p-2 m-2 mt-1 rounded border-2 focus:border-blue-300 outline-none"
            onChange={setNameChange}/>
        )}
        <label className="text-left ml-2 mt-1 font-medium font-sans BlinkMacSystemFont" style={{color:'white'}}>Email</label>
        <input id="email" type="email" required
          className="p-2 m-2 mt-1 rounded border-2 focus:border-blue-300 outline-none"
          onChange={setEmailChange}/>
        <label className="text-left ml-2 mt-4 font-medium" style={{color:'white'}}>Password</label>
        <input type="password" required
          className="p-2 m-2 mt-1 rounded border-2 focus:border-blue-300 outline-none"
          onChange={setPasswordChange}/>
        <button onClick={submit} className="p-2 m-1 bg-blue-500 rounded text-white h-10 hover:bg-blue-600 mt-4">{props.type}</button>
      </div>
    </form>
  );
};

export default AuthCard;
