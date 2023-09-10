import React, {useState} from "react";
import { NavLink, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions";
import companyLogo from '../assets/logo.png';

const NavBar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.loading);
  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  function setLogout() {
    dispatch(logout());
    history.push("/login");
    return;
  }

  const onPress = (event) => {
    if(event.key === "Enter") {
      if(search !== "") history.push(`/search/${search}`)
      else history.push("/");
    }
  }

  const setSearchChange = (event) => { setSearch(event.target.value.toLowerCase()); }
  
  return (
    <div className="flex items-center z-10 justify-between w-screen py-1 px-7 shadow-md fixed border-t-4 border-yellow-500" style={{ backgroundColor: "#202124" }}>
      <div className="hover:gray-300 ml-24">
        <NavLink to="/">
        <img src={companyLogo} alt="logo" style={{width:200, height:50}}/>
          </NavLink>
      </div>
      <div className="flex items-center w-1/2 ">
        <input type="search" className="placeholder-gray-500 w-full h-10 border-2 border-gray-200 p-3 rounded focus:border-blue-300 outline-none"
        placeholder="Search" onChange={setSearchChange} onKeyUp={onPress}/>
      </div>
      <div className={`flex items-center justify-evenly ${loading ? "invisible" : "visible"}`}>
        {isAuthenticated ? (
          <>
            <Link to={`/users/${user._id}`}><img className="w-8 h-8 border border-gray-300" alt = "img" src={`https://secure.gravatar.com/avatar/${user.name}?s=164&d=identicon`}></img></Link>
            <Link to={`/users/${user._id}`}><span className="p-1" style={{color:'white'}}> {user.name}</span></Link>
            <button onClick={setLogout} 
            className="flex items-center p-2 m-1 ml-6 h-10 bg-blue-500 border-2 border-blue-700 rounded text-white hover:bg-blue-600">Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">
            <button className="flex items-center p-2 m-1 h-10 rounded bg-blue-100 border-2 border-blue-300 hover:bg-blue-200 text-blue-600">Log in</button>
            </NavLink>
            <NavLink to="/register">
            <button className="flex items-center p-2 m-1 bg-blue-500 border-2 border-blue-700 rounded text-white hover:bg-blue-600 h-10">Sign up</button>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
