const fs = require('fs');
const data = require('./data.json');

module.exports = {
  save(fn) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
      return fn();
    });
  },
  createNewQuestion(questionBody, fn){
    const question = {
      question_id: module.exports.generateRandomID('q'),
      questionBody: questionBody,
      answers: []
    }
    data.questions.push(question);
    return fn(question);
  },
  getQuestion(id) {
    return data.questions.find(question => {
      return question.question_id == id
    });
  },
  getAnswer(qID, aID){
    return getQuestion(qID).answers.find( answer => {
      return answer.answer_id == aID;
    });
  },
  generateRandomID(type){
    return type + Math.floor(Math.random() * 10000);
  }
};

