const axios = require("axios");
const API = axios.create({ baseURL: "http://localhost:3030/api" });

API.interceptors.request.use(function (config) {
	config.headers.authorization = `Bearer ${localStorage.token}`
	return config;
});

export const getAllUsers = () => API.get('/user');
export const getUser = (user_id) => API.get('/user/'+user_id)
export const createUser = (User) => API.post("/register", User);
export const loadUserCall = () => API.get("/auth");
export const checkUser = (User) => API.post("/login", User);
export const clearToken = () => API.delete("/logout");
export const getTopTags = () => API.get("/question/topTags");
export const getQuestions = () => API.get("/question");
export const getTopQuestions = () => API.get("/question/top");
export const getQuestionsTags = (Tags, pathname) => API.post(`/question/tags/`+ pathname, Tags);
export const getQuestion = (id) => API.get("/question/" + id);
export const createQuestion = (Question) => API.post("/question/ask", Question);
export const updateQuestion = (Question, id) => API.patch("/question/" + id, Question);
export const deleteQuestion = (id) => API.delete("/question/" + id);
export const voteQAPI = (question_id, vote) => API.patch("/question/vote/" + question_id, { vote });
export const answerQuestion = (Answer, question_id) => API.post("/question/answers/" + question_id, Answer);
export const getAllAnswers = (questionId) => API.get("/question/answers/" + questionId);
export const updateAnswer = (Answer, id) => API.patch("/answer/" + id, Answer);
export const voteAnsAPI = (answer_id, vote) => API.patch("/answer/vote/" + answer_id, { vote });
export const deleteAnswer = (answer_id) => API.delete("/answer/"+ answer_id);
export const updateUserAPI = ({name, password, newPassword, confirmPassword, id}) => API.patch("/user/"+ id, {name, password, newPassword, confirmPassword});