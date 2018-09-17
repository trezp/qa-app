const fs = require('fs');
const data = require('./data.json');

//To DO
// reorganize exports
function generateRandomId(){
  return Math.floor(Math.random() * 10000);
}

async function save(cb){
  fs.writeFile('data.json', JSON.stringify(data, null, 2), cb);
}

function getAll(){
  return data.questions;
}

function getQuestion(id){
  return data.questions.find(question => question.question_id == id);
}

function getAnswer(qID, aID){
  return getQuestion(qID).answers.find(answer => answer.answer_id == aID);
}

async function createQuestion(body) {
  const question = {
    question_id: generateRandomId(),
    question: body, 
    answers: []
  }
  data.questions.push(question);
  await save(); 
  return question; 
}

async function createAnswer(body, qID) {
  const answer = {
    answer_id: generateRandomId(),
    answer: body, 
    votes: 0
  }
  getQuestion(qID).answers.push(answer);
  await save(); 
  return answer;
}

async function voteUp(answer){
  answer.votes += 1; 
  await save();
}

async function voteDown(answer){
  answer.votes -= 1; 
  await save();
}

async function editQuestion(question, body){
  question.question = body.question;
  await save();
}

async function editAnswer(answer, body){
  answer.answer = body;
  await save();
}

async function deleteQuestion(result){
  data.questions = data.questions.filter(question => question.question_id != result.question_id);
  await save();
}

async function deleteAnswer(question, result){
  question.answers = question.answers.filter(answer => answer.answer_id != result.answer_id);
  await save();
}

module.exports = {
  getAll,
  getQuestion, 
  getAnswer, 
  createQuestion, 
  createAnswer,
  voteUp,
  voteDown,
  editQuestion,
  editAnswer,
  deleteQuestion,
  deleteAnswer
}
