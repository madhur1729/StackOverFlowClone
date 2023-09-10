import {  
  createUser, 
  checkUser, 
  loadUserCall, 
  createQuestion, 
  deleteQuestion, 
  getQuestions, 
  getQuestion, 
  getQuestionsTags, 
  getTopQuestions,
  getAllAnswers, 
  deleteAnswer } from "../api";

export const setAlert = ({ message, status }, timeout = 2500) => (dispatch) => {
  dispatch({ type: "SET_ALERT", payload: { message, status } });
  setTimeout(() => dispatch({ type: "REMOVE_ALERT" }), timeout);
};

export const setLoadingAction = () => (dispatch) => {
  dispatch({ type: "SET_LOADING" });
};

export const stopLoadingAction = () => (dispatch) => {
  dispatch({ type: "STOP_LOADING" });
};

export const loadUser = () => (dispatch) => {
  if (localStorage.token) {
    loadUserCall().then((res) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      dispatch(stopLoadingAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(stopLoadingAction());
    });
  } 
  else dispatch(stopLoadingAction());
};

export const register = ({ name, email, password }) => (dispatch) => {
  const body = { name, email, password };
  createUser(body).then((res) => {
    localStorage.setItem("token", res.data.data.token);
    res.data.status = true;
    dispatch(setAlert(res.data));
    dispatch({ type: "REGISTER_SUCCESS", payload: res.data.data });
  })
  .catch((error) => {
    error.response.data.status = false;
    dispatch(setAlert(error.response.data));
  });
};


export const login = ({ email, password }) => (dispatch) => {
  const body = { email, password };
  checkUser(body).then((res) => {
    localStorage.setItem("token", res.data.data.token);
    console.log(res.data.data);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
    res.data.status = true;
    dispatch(setAlert(res.data));
  })
  .catch((error) => {
    error.response.data.status = false;
    dispatch(setAlert(error.response.data));
  });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(setAlert({ message: "User logged out successfully", status: true }));
  dispatch({ type: "LOGOUT" });
};

export const getQuestionsAction = () => (dispatch) => {
  dispatch({ type: "GET_QUESTION_REQUEST" });
  getQuestions().then((res) => {
    dispatch({ type: "GET_QUESTIONS", payload: res.data.data });
  })
  .catch((error) => { return console.log(error); });
};

export const getTopQuestionsAction = () => (dispatch) => {
  dispatch({ type: "GET_QUESTION_REQUEST" });
  getTopQuestions().then((res) => {
    dispatch({ type: "GET_QUESTIONS", payload: res.data.data });
  })
  .catch((error) => { return console.log(error); });
};

export const getQuestionsByTags = (tags, pathname) => (dispatch) => {
  const Tags = { tags };
  if (pathname === "/") pathname = "top";
  else if (pathname === "/questions") pathname = "all";
  getQuestionsTags(Tags, pathname).then((res) => {
    dispatch({ type: "GET_QUESTION_BY_TAGS", payload: res.data.data });
  })
  .catch((error) => { return console.log(error); });
};

export const getQuestionAction = (question_id, history, voteChange) => (dispatch) => {
  if (!voteChange) dispatch({ type: "GET_QUESTION_REQUEST" });
  getQuestion(question_id).then((res) => {
    dispatch({ type: "GET_QUESTION", payload: res.data.data });
  })
  .catch((error) => { history.push("/notfound"); });
};

export const createQuestionAction = (question, history) => async (dispatch) => {
  createQuestion(question).then((res) => {
    dispatch({ type: "CREATE_QUESTION", payload: question });
    dispatch(setAlert({ message: "Question posted", status: true }));
    history.push(`/question/${res.data.newQuestion._id}`);
  })
  .catch((error) =>
    dispatch(setAlert({ message: error.message, status: false }))
  );
};

export const questionDeleteAction = (id, history) => async (dispatch) => {
  deleteQuestion(id).then((res) => {
    dispatch({ type: "DELETE_QUESTION" });
    dispatch(setAlert({ message: "Question deleted", status: true }));
  })
  .catch((error) => { return console.log(error); });
  history.push("/");
};

export const getAnswers = (question_id) => async (dispatch) => {
  dispatch({ type: "GET_ANSWERS_REQUEST" });
  getAllAnswers(question_id)
  .then((res) => dispatch({ type: "GET_ANSWERS", payload: res.data.data }) )
  .catch((error) => dispatch( setAlert({ message: "Unable to fetch all Answers", status: false }) ) );
};

export const deleteAnswerAction = (answerId) => async (dispatch) => {
  try {
    deleteAnswer(answerId).then(res => {
      dispatch({ type: "DELETE_ANSWER", payload: res.data.data });
      dispatch(setAlert({ message: res.data.message, status: true }));
    });
  } 
  catch (err) {
    dispatch(setAlert({ message:  err.response.message, status: false }));
  }
};
