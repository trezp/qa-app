const express = require('express');
const bodyParser = require('body-parser')
const data = require('./data.json');
const records = require('./records');
const fs = require('fs');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

// GET all questions
app.get('/questions', (req, res) => res.json(data.questions));

// POST Create a new question
app.post('/questions', (req, res) => {
  if(!req.body.question){
    res.status(404).json({error: "Expecting a question."});
  } else {
    records.createNewQuestion(req.body.question, (question) => {
      res.status(201).json(question);
    });
  }
});

// GET specific question
app.get('/questions/:qID', (req, res) => {
  records.fetchQuestion(req.params.qID, (question) => {
    if (!question){
      res.status(400).json({
        error: "Question not found"
      });
    } else {
      res.json(question);
    }
  });
}); 

// POST a new answer
app.post('/questions/:qID', ( req, res ) => {

  if (!req.body.answer){
    res.status(404).json({
      error: "Oops! You must provide an answer."
    });
  } else {
    records.createNewAnswer(req.params.qID, req.body.answer, (question) =>{
      res.status(201).json(question);
    });
  }

});

// Vote up an answer up
app.post('/questions/:qID/answers/:aID/vote-up', (req, res) => {
  const answer = getAnswer(req.params.qID, req.params.aID);

  if (answer){
    answer.votes += 1
    fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
      res.json(data);
    });
  } else {
    res.status(404).json({error: "Answer not found"});
  }
});

// Vote an answer down 
app.post('/questions/:qID/answers/:aID/vote-down', (req, res) => {
  const answer = getAnswer(req.params.qID, req.params.aID);
  
  if (answer){
    answer.votes -= 1
    fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
      res.json(data);
    });
  } else {
    res.status(404).json({error: "Answer not found"});
  }
});

// James: We don't cover editing or deleting a question or answer in the course, but I did 
// it anyway just for funsies. I don't know if we want to go this far in the course.

// EDIT A QUESTION
app.put('/questions/:qID', (req, res) => {
  const question = getQuestion(req.params.qID);

  if(question){
    question.question = req.body.question;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
      res.json(data);
    });
  } else {
    res.json(data);
  }
});

//EDIT AN ANSWER

app.put('/questions/:qID/answers/:aID', (req, res) => {
  const answer = getAnswer(req.params.qID, req.params.aID);

  if(answer){
   answer.answer = req.body.answer;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
      res.json(data);
    });
  } else {
    res.json(data);
  }
});

//DELETE A QUESTION 

app.delete('/questions/:qID', (req, res) => {

  data.questions = data.questions.filter(question => {
    return question.question_id != req.params.qID
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
    res.json(data);
  });
});

// DELETE AN ANSWER 
app.delete('/questions/:qID/answers/:aID', (req, res) => {
  const question = getQuestion(req.params.qID);

  question.answers = question.answers.filter(answer => {
    return answer.answer_id != req.params.aID
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), ()=>{
    res.json(data);
  });
});

// DELETE everything (for testing only)
app.get('/remove', (req, res) => {
  data.questions = [];
  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.end();
}); 

app.use(function(req, res, next){
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));



