import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LeftSide from "../components/LeftSide";
import Alert from "../components/Alert";
import Question from "./Question/Question";
import Answer from "./Answer/Answer";

const ViewQuestion = () => {
  const location = useLocation();
  const loadingAnswers = useSelector(state => state.answer.loading)
  const loadingQuestion = useSelector(state => state.question.loading)
  
  return (
    <React.Fragment>
      <Alert />
      <LeftSide/>
      <div className="flex flex-row pl-72 min-h-screen" style={{ backgroundColor: "rgb(50, 50, 50)"}}>
        <div className="flex flex-col w-3/4">
          <Question question_id={location.pathname.split('/')[2]} />
          <Answer question_id = {location.pathname.split('/')[2]} />
        </div>
        <div className="mt-16 mr-10 ml-10 w-1/4">{(!loadingAnswers && !loadingQuestion)}</div>
      </div>
    </React.Fragment>
  );
};

export default ViewQuestion;
