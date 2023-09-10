import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/actions";
import Alert from "../components/Alert";
import { updateUserAPI } from "../api";

const EditUserProfile = (props) => {
	const editClickHandler = props.editClickHandler;
	const dispatch = useDispatch();
	const user = props.user;
	const [name, setName] = useState(user.name);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const setNameChange = (event) => { setName(event.target.value); };
	const setPasswordChange = (event) => { setPassword(event.target.value); };
	const setNewPasswordChange = (event) => { setNewPassword(event.target.value); };
	const setConfirmPasswordChange = (event) => { setConfirmPassword(event.target.value); };

	const submit = (event) => {
		event.preventDefault();
		if (password.trim() === "" || (name.trim() === "" && newPassword.trim() === "")) {
			return dispatch(setAlert({ message: "One or more required fields is empty", status: false }));
		}
		let newPasswordvar = newPassword.trim();
		let confirmPassvar = confirmPassword.trim();
		if (newPasswordvar.length > 0 && newPasswordvar.length < 6) {
			return dispatch(setAlert({message: "Password must be of minimum 6 characters", status: false }));
		}
		if (newPasswordvar !== confirmPassvar) {
			return dispatch(setAlert({ message: "New password and Confirm password are not same", status: false }));
		}

		updateUserAPI({ id: user._id, name, password, newPassword, confirmPassword })
		.then((res) => {
			console.log("updated succesfully");
			dispatch(setAlert({ message: "User updated", status: true }));
			dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.data.data } })
			return editClickHandler();
		})
		.catch((error) => {
			console.log(error.response)
			dispatch(setAlert({ message: error.response.data.message, status: false }));
		});
	};

	return (
		<div className="flex flex-col items-start ml-32 w-full">
			<Alert />
			<div className="flex justify-between mb-6 items-center w-1/2">
				<label className="text-left text-white font-medium font-sans BlinkMacSystemFont">Username</label>
				<input id="displayName" type="text" value={name} required
					className="p-2 rounded border-2 focus:border-blue-300 outline-none"
					onChange={setNameChange}/>
			</div>
			<div className="flex justify-between mb-6 items-center w-1/2">
				<label className="text-left text-white font-medium font-sans BlinkMacSystemFont">Password</label>
				<input placeholder="Required" type="password" required
					className="p-2 rounded border-2 focus:border-blue-300 outline-none"
					onChange={setPasswordChange}/>
			</div>
			<div className="flex justify-between mb-6 items-center w-1/2">
				<label className="text-left text-white font-medium font-sans BlinkMacSystemFont">New Password</label>
				<input placeholder="Keep blank for no change" type="password"
					className="p-2 rounded border-2 focus:border-blue-300 outline-none"
					onChange={setNewPasswordChange}/>
			</div>
			<div className="flex justify-between mb-6 items-center w-1/2">
				<label className="text-left text-white font-medium font-sans BlinkMacSystemFont">Confirm New Password</label>
				<input placeholder="Keep blank for no change" type="password"
					className="p-2 rounded border-2 focus:border-blue-300 outline-none"
					onChange={setConfirmPasswordChange}/>
			</div>
			<div className="w-1/2">
				<button onClick={submit} className="p-2 m-1 px-5 bg-blue-500 rounded text-white h-10 hover:bg-blue-600 mt-4">Save</button>
			</div>
		</div>
	);
};

export default EditUserProfile;
