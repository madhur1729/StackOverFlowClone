import React from "react";
import { Link, NavLink}   from "react-router-dom";
import moment from "moment";

const EachQuestion = (props) => {
  const question = props.data;
  const loading = props.loading;
  let idx = 1000;
  if(!loading && question && question.description) { idx = question.description.indexOf("~~~js") }
  
  return (
    <>
      {!loading && (
        <div className=" p-3 flex border-r border-t border-b border-gray-200 text-left" style={{ backgroundColor: "#202124" }}>
          <div className="flex flex-col mr-2 items-center">
            <span className=" flex flex-col text-xs text-center py-2 px-5 text-gray-200">
              <span className="text-sm">{question && question.upvotes.length - question.downvotes.length}</span>
              {Math.abs(question.upvotes.length - question.downvotes.length) === 1 ? "vote" : "votes"}
            </span>
            <span className="flex flex-col text-center py-2 px-5 text-xs text-gray-200">
              <span className="text-sm">{question.answers.length}</span>{" "}
              {question.answers.length === 1 ? "answer" : "answers"}
            </span>
          </div>

          <div className="flex flex-col justify-left w-full">
            <div className="text-md semibold" style={{ color: "#0077CC" }}>
              <NavLink to={`/question/${question._id}`} className="hover:text-blue-400">
                <span>{question.title.length > 110 ? (
                  <span>{question.title.substring(0, Math.min(question.title.length, 110))}...</span>
                  ) : (
                  <span>{question.title.substring(0, Math.min(question.title.length, 110))}</span>
                )}</span>
              </NavLink>
            </div>
            <div className="py-2 text-sm">
              {question.description.length > 400 ? (
                <span>{question.description.substring(0, Math.min(idx,Math.min(question.description.length, 400)))}...</span>
                ) : (
                <span>{question.description.substring(0, Math.min(idx,Math.min(question.description.length, 400)))}</span>
              )}
            </div>
            <div className="flex justify-between">
              <div>
                {question.tags.map((tag, index) => (
                  <span key={`${index}`}
                    className="m-1 text-xs px-2 py-0.5 border-2 border-blue-100 hover:bg-blue-200 text-blue-600  rounded"
                    style={{ backgroundColor: "#E1ECF4" }}>{tag}</span>
                ))}
              </div>
              <div className="flex flex-col w-36">
                <span className="text-gray-500">{moment(question.createdAt).fromNow()}</span>
                <div className="flex flex-row">
                  <img alt = "img" className="w-8 h-8 border border-gray-300" src={`https://secure.gravatar.com/avatar/${question.author.name}?s=164&d=identicon`}></img>
                <Link to={`/users/${question.author._id}`} className="text-right pl-1 text-blue-400 hover:text-blue-200">{question.author.name}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EachQuestion;
