import React from "react";
import Alert from "../components/Alert";
import LeftSide from "../components/LeftSide";
import RightSide from "../components/RightSide";
import Questions from "../components/Questions";
import { useState } from "react";

const Home = () => {
  window.scrollTo(0,0);
  const [tagsArray, setTagsArray] = useState([]);
  const getTags = (tags) => { setTagsArray(tags); };
  
  return (
    <React.Fragment>
      <div className="min-h-screen " style={{ backgroundColor: "rgb(50, 50, 50)"}}>
      <Alert />
      <LeftSide />
      <div className="flex flex-row pl-72" style={{ backgroundColor: "rgb(50, 50, 50)"}}>
        <Questions tagsArray={tagsArray}  title="Top Questions"/>
        <RightSide getTags={getTags} />
      </div>
      </div>
    </React.Fragment>
  );
};
export default Home;