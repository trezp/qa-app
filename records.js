const fs = require('fs');
const data = require('./data.json');

//To DO
//exports.getQuestions
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

module.exports = {
  getAll,
  getQuestion, 
  getAnswer, 
  createQuestion, 
  createAnswer
}
// function savePromise(){
//   return new Promise( (resolve,reject) => {
//     //reject(new Error("test error"));
//     fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
//       if (err){
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });
// }

// function save(){}

// change to getQuestion 


// exports.getQuestion = async (id, cd) => {
//   const question = data.questions.find(question => question.question_id == id);
// }

// exports.getQuestionPromise = (id) => {
//   const question = data.questions.find(question => question.question_id == id);
//   return Promise.resolve(question);
// }



// split into two 
// exports.create = (body, id, cb) => {

//   if (!id) {
//     const question = {
//       question_id: module.exports.generateRandomId(),
//       question: body, 
//       answers: []
//     }
//     data.questions.push(question);
//     return cb(question);
//   } else {
//     const answer = {
//       answer_id: module.exports.generateRandomId(),
//       answer: body, 
//       votes: 0
//     }
  
//     module.exports.fetchQuestion(id, (question)=> {
//       question.answers.push(answer);
//       return cb(question);
//     });
//   }

// }



// exports.update = (qID, aID, body, cb) => {

//   if (!aID) {
//     module.exports.fetchQuestion(qID, (question) => {
//       question.question = body.question;
//     });
//   } else {
//     module.exports.fetchAnswer(qID, aID, (answer) => {
//       console.log(answer)
//       answer.answer = body.answer;
//     });
//   }
//   return cb();
// }

// exports.delete = (qID, aID, cb) => {
//   module.exports.fetchQuestion(qID, (question) => {
//     if (question){
//       if (!aID) {
//         data.questions = data.questions.filter(question => question.question_id != qID);
//       } else {
//         question.answers = question.answers.filter(answer => answer.answer_id != aID);
//       }
//     } 
//     return cb();
//   });
// }



//TO DO
// Location header
// Throw error if deleted question/answer does not exist
