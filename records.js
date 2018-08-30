const fs = require('fs');
const data = require('./data.json');

exports.save = (obj, cb) => {
  data.questions.push(obj);
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(){
    return cb(obj);
  });
}

exports.fetchQuestion = (id, cb) => {
  const question = data.questions.find(question => {
    return question.question_id == id;
  });
  return cb(question);
}

exports.fetchAnswer = (qID, aID, cb) => {
  const answer = modules.exports.fetchQuestion(qID).answers.find( answer => {
    return answer.answer_id == aID;
  });
  return cb(answer);
}

exports.createNewQuestion = (body, cb) => {
  const question = {
    question_id: module.exports.generateRandomId(),
    questionBody: body, 
    answers: []
  }
  module.exports.save(question, cb);
}

exports.generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
}
