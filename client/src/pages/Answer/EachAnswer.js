import { useState } from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { UpArrowInactive, UpArrowActive } from "../../assets/svg/UpArrow";
import { DownArrowInactive, DownArrowActive } from "../../assets/svg/DownArrow";
import { EditAnswer } from "./EditAnswer";
import { voteAnsAPI } from "../../api";
import { setAlert, deleteAnswerAction, getAnswers } from "../../redux/actions";

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter wrapLongLines="true" wrapLines="true"
        language={match[1]} PreTag="div"
        children={String(children).replace(/\n$/, "")} {...props}/>
    ) : (
      <code className={className} {...props} />
    );
  },
};

const EachAnswer = (props) => {
  const dispatch = useDispatch();
  const user = props.user;
  const answer = props.answer;

  const [clicked, setClicked] = useState(false);
  const discardHandler = (event) => { setClicked(false); };

  const deleteAnswerHandler = (event) => {
    const value = window.confirm('Delete Answer?');
    if(value) dispatch(deleteAnswerAction(answer._id));
    return;
  };

  const editClickHandler = (event) => {
    event.preventDefault();
    var element = document.getElementById("answer-desc");
    var rect = element.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top / 2);
    setClicked(true);
  };

  const voteHandler = (voteType) => {
    voteAnsAPI(answer._id, voteType).then((res) => {
      dispatch(setAlert({ message: res.data.message, status: true }));
      dispatch(getAnswers(props.question_id))
    })
    .catch((error) => {
      if (error.response.status === 401) dispatch(setAlert({ message: "Please login", status: false }));
      else dispatch(setAlert({ message: "Please try again later", status: false }));
    });
  };

  return (
    <div className="mt-2 flex flex-col w-full mb-6 border-b border-gray-300" style={{ backgroundColor: "rgb(40, 40, 40)"}}>
      {!clicked && (
        <div className="flex pl-4 pt-4">
          <div className="flex flex-col items-center pt-2 ">
            {user && answer.upvotes.includes(user._id) ? (
              <button onClick={() => { voteHandler(true); }}><UpArrowActive /></button>
            ) : (
              <button onClick={() => { voteHandler(true); }}><UpArrowInactive /></button>
            )}

            <span style={{ color: "white"}}>{answer.upvotes.length - answer.downvotes.length}</span>

            {user && answer.downvotes.includes(user._id) ? (
              <button onClick={() => { voteHandler(false); }}><DownArrowActive /></button>
            ) : (
              <button onClick={() => { voteHandler(false); }}><DownArrowInactive /></button>
            )}
          </div>
          <div className="flex flex-col justify-between w-full text-left pl-2 mb-2 text-white">
            <div id="answer-desc" className="pb-14 whitespace-pre-line">
              <ReactMarkdown components={components} children={answer.description}/>
            </div>
            <div className="text-right flex justify-between items-center text-xs  ">
              <div className="text-base">
                {answer && user && user._id === answer.author._id && (
                  <button onClick={editClickHandler}>
                    <span className="flex items-center p-2 m-1 mt-3 border-2 border-blue-700 rounded text-white">edit</span>
                  </button>
                )}
                {answer && user && user._id === answer.author._id && (
                  <button onClick={deleteAnswerHandler}>
                    <span className="flex items-center p-2 m-1 mt-3 border-2 border-red-700 rounded text-white">delete</span>
                  </button>
                )}
              </div>
              <div className=" px-2 pr-4 m-1 rounded bg-blue-100 border-blue-300 border flex flex-col">
                <div className="pb-1">
                  <span className="text-gray-500">answered </span>
                  <span className="text-gray-500">{moment(answer.createdAt).fromNow()}</span>
                </div>
                <div className="flex flex-row pb-1">
                  <img alt="img" className="w-8 h-8 border border-gray-300"
                    src={`https://secure.gravatar.com/avatar/${answer.author.name}?s=164&d=identicon`}
                  ></img>
                  <Link to={`/users/${answer.author._id}`}
                    className="text-right pl-1 text-blue-400 hover:text-blue-200">{answer.author.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {clicked && (<EditAnswer answer={answer} discardHandler={discardHandler} />)}
    </div>
  );
};

export default EachAnswer;
