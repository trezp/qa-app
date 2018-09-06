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

exports.create = (body, id, cb) => {

  if (!id) {
    const question = {
      question_id: module.exports.generateRandomId(),
      question: body, 
      answers: []
    }
    data.questions.push(question);
    return cb(question);
  } else {
    const answer = {
      answer_id: module.exports.generateRandomId(),
      answer: body, 
      votes: 0
    }
  
    module.exports.fetchQuestion(id, (question)=> {
      question.answers.push(answer);
      return cb(question);
    });
  }

}

exports.update = (qID, aID, body, cb) => {

  if (!aID) {
    module.exports.fetchQuestion(qID, (question) => {
      question.question = body.question;
    });
  } else {
    module.exports.fetchAnswer(qID, aID, (answer) => {
      console.log(answer)
      answer.answer = body.answer;
    });
  }
  return cb();
}

exports.delete = (qID, aID, cb) => {
  module.exports.fetchQuestion(qID, (question) => {
    if (question){
      if (!aID) {
        data.questions = data.questions.filter(question => question.question_id != qID);
      } else {
        question.answers = question.answers.filter(answer => answer.answer_id != aID);
      }
    } 
    return cb();
  });
}

exports.generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
}

//TO DO
// Location header
// Throw error if deleted question/answer does not exist
