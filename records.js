const fs = require('fs');
const data = require('./data.json');

function generateRandomId(){
  return Math.floor(Math.random() * 10000);
}

function save(){
  return new Promise((resolve, reject) => {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function getAll(){
  return data.questions;
}

async function getQuestion(id, next){
  return data.questions.find(question => question.question_id == id);
}

async function getAnswer(question, aID){
  const answer = question.answers.find(answer => answer.answer_id == aID);
  return answer;
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

async function createAnswer(record, body) {
  const answer = {
    answer_id: generateRandomId(),
    answer: body, 
    votes: 0
  }
  const question = await getQuestion(record.question_id);
  question.answers.push(answer);
  return save(); 
}

async function voteUp(answer){
  answer.votes += 1; 
  return save();
}

async function voteDown(answer){
  answer.votes -= 1; 
  return save();
}

async function editQuestion(question, body){
  question.question = body.question;
  return save();
}

// async function editAnswer(answer, body){
//   answer.answer = body.answer;
//   return save();
// }

async function editAnswer(question, aID, body){
  const answer = await getAnswer(question.question_id, aID); 
  answer.answer = body.answer;
  return save();
}

async function deleteQuestion(result){
  data.questions = data.questions.filter(question => question.question_id != result.question_id);
  return save();
}

async function deleteAnswer(question, result){
  question.answers = question.answers.filter(answer => answer.answer_id != result.answer_id);
  return save();
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
