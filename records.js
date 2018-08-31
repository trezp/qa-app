const fs = require('fs');
const data = require('./data.json');

exports.save = (cb) => {
  fs.writeFile('data.json', JSON.stringify(data, null, 2), cb);
}

exports.fetchQuestion = (id, cb) => {
  const question = data.questions.find(question => question.question_id == id);
  return cb(question);
}

exports.fetchAnswer = (qID, aID, cb) => {
  const answer = module.exports.fetchQuestion(qID, (question) => {
    return question.answers.find(answer => answer.answer_id == aID);  
  });
  return cb(answer);
}

exports.createNewQuestion = (body, cb) => {
  const question = {
    question_id: module.exports.generateRandomId(),
    questionBody: body, 
    answers: []
  }
  data.questions.push(question);
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
    return cb(question);
  });
}

exports.update = (id, body, cb) => {
  const question = module.exports.fetchQuestion(id, (question) => {
    question.questionBody = body;
    return question
  });
  return cb(question);
}

exports.generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
}

//TO DO
// Location header
// vote up/down
// Edit/delete
