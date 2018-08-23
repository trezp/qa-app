const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const data = require('./data.json');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

// GET all questions
app.get('/questions', (req, res) => res.json(data.questions));

// GET specific question
app.get('/questions/:qID', (req, res) => {
  const question = getQuestion(req.params.qID);
  res.json(question);
}); 

// GET all answers to specific question
app.get('/questions/:qID/answers', (req, res) => {
  const answers = getQuestion(req.params.qID).answers
  res.json(answers);
}); 

// GET specific answer to specific question
app.get('/questions/:qID/answers/:aID', (req, res) => {
  const answer = getAnswer(req.params.qID, req.params.aID);
  res.json(answer);
}); 

// POST a new question
app.post('/questions', (req, res) => {
  
  data.questions.push({
    "question_id": data.questions.length, 
    "question": req.body.question,
    "answers": []
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
});

// POST a new answer
app.post('/questions/:qID', ( req, res ) => {
  const question = getQuestion(req.params.qID);

  question.answers.push({
    "answer_id": `a${question.answers.length}`, 
    "answer": req.body.answer,
    "votes": 0
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
});

// DELETE questions (for testing only)
app.get('/remove', (req, res) => {
  data.questions = [];
  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
}); 

app.listen(3000, () => console.log('Example app listening on port 3000!'));


////    HELPER FUNCTIONS  ////
function getQuestion(id){
  return data.questions.find(question => {
    return question["question_id"] == id
  });
}

function getAnswer( qID, aID){
  return getQuestion(qID).answers.find( answer => {
    return answer["answer_id"] == aID;
  });
}

//TO DO 
// error handling
// delete a question
// delete an answer
// edit a question
// edit an answer