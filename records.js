const fs = require('fs');
const data = require('./data.json');

exports.save = () => {
  fs.writeFile('data.json', JSON.stringify(data, null, 2));
}

exports.fetchQuestion = (id, cb) => {
  const question = data.questions.find(question => question.question_id == id);
  return cb(question);
}

exports.fetchAnswer = (qID, aID) => {
  return modules.exports.fetchQuestion(qID, (question) => question.answers.answer_id);
}

exports.createNewQuestion = (body, cb) => {
  const question = {
    question_id: module.exports.generateRandomId(),
    questionBody: body, 
    answers: []
  }
  data.questions.push(question);
  module.exports.save();
  return cb(question);
}

exports.createNewAnswer = (id, body, cb) => {
  const answer = {
    answer_id: module.exports.generateRandomId(),
    answerBody: body, 
    votes: 0
  }

  module.exports.fetchQuestion(id, (question)=> {
    question.answers.push(answer);
    module.exports.save();
    return cb(question);
  });
}

exports.generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
}

//TO DO
// Location header
// vote up/down
// Edit/delete
