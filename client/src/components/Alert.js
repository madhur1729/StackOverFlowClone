import { useSelector } from "react-redux";

const Alert = () => {
  const alert = useSelector((state) => state.alert );
  return (
    <div className={`${alert.visible ? "fixed" : "hidden"}	bg-${alert.status ? "gray-200" : "red-400"} 
 z-100 top-16 text-black font-semibold rounded inset-x-0 m-auto `} style={{height: 40, width: 400, alignContent: "center", justifyContent: "center", paddingTop: 10, paddingBottom: 5}}> {alert.message} </div>
  );
};

export default Alert;
