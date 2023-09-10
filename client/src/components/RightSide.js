import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTopTags } from "../api";

const TopTags = () => {
  const [topTags, setTopTags] = useState([]);

  useEffect(() => {
    getTopTags()
      .then((res) => {
        return setTopTags(res.data.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, []);

  return (
    <div className="my-4 rounded border border-gray-300 shadow-md">
      <h1 className="h-11 pl-4 text-white text-sm font-semibold bg-gray-100 border-b border-gray-300  rounded-t-md  flex items-center text-md " style={{ backgroundColor: "#202124" }}>
        Top Tags
      </h1>
      <div className=" flex-wrap flex pl-1 ">
        {topTags &&
          topTags.map((tag, index) => (
            <div
              key={index}
              className="m-1 text-xs px-2 py-0.5 bg-blue-100 border-2 border-blue-100 hover:bg-blue-200 text-blue-600 my-1.5  rounded "
            >{`${tag[0]} x ${tag[1]}`}</div>
          ))}
      </div>
    </div>
  );
};

const RightSide = (props) => {
  const { loading } = useSelector((state) => state.question);

  return (
    <>
      {!loading && (
        <div className="flex flex-col w-1/3 ml-10 mr-10 mt-16" style={{ backgroundColor: "rgb(50, 50, 50)"}}>
          <TopTags />
        </div>
      )}
    </>
  );
};

export default RightSide;
