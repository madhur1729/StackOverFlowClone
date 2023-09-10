import React, { useEffect, useState } from "react";
import LeftSide from "../components/LeftSide";
import { getAllUsers } from "../api";
import UserCard from "../components/UserCard";
import { useDispatch } from "react-redux";
import {setAlert} from "../redux/actions"

const Users = () => {
  window.scrollTo(0,0);
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const dispatch = useDispatch();

  const setSearchChange = (event) => { setVisibleUsers([ ...users.filter((user) => user.name.includes(event.target.value)), ]); };
  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.data.data);
      setVisibleUsers(res.data.data);
    })
    .catch((error) => {
      dispatch(setAlert({ message: "An error occurred!", status: false }));
    });
  }, [dispatch]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(50, 50, 50)"}}>
      <div className="flex flex-row">
        <LeftSide />
        <div className="mt-24 pl-72 text-left w-screen">
          <div className="text-3xl text-white pl-5 mb-10"> Users </div>
          <div className="items-center">
            <input type="search"
              className="placeholder-gray-500 w-52 h-10 ml-4 items-center mb-8 border-2 border-gray-200 p-3 rounded focus:border-blue-300 outline-none"
              placeholder="Search users" onChange={setSearchChange}/>
          </div>
          <div className="flex flex-row justify-left flex-wrap">
            {users && users.length > 0 && visibleUsers.map((user, index) => ( <UserCard key={index} user={user} /> ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Users;