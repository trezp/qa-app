const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

const data = require('./data.json');
const records = require('./records');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

// GET all questions
app.get('/questions', (req, res) => res.json(data.questions));

// POST Create a new question
app.post('/questions', (req, res) => {
  if(!req.body.question){
    res.status(404).json({error: "Expecting a question."});
  } else {
    records.create(req.body.question, null, (question) => {
      records.save( ()=> res.status(201).json(question));
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
    res.status(400).json({
      error: "Oops! You must provide an answer."
    });
  } else {
    records.create(req.body.answer, req.params.qID, (question) => {
      records.save( () => {res.status(201).json(question)});
    });
  }
});

// Vote up an answer up
app.post('/questions/:qID/answers/:aID/vote-up', (req, res) => {
  records.fetchAnswer(req.params.qID, req.params.aID, (answer) => {
    if (!answer){
      res.status(400).json({error: "Answer not found"});
    } else {
      answer.votes += 1
      records.save(() => res.status(204).json({}));
    }
  });
});

// Vote an answer down 
app.post('/questions/:qID/answers/:aID/vote-down', (req, res) => {
  records.fetchAnswer(req.params.qID, req.params.aID, (answer) => {
    if (!answer){
      res.status(400).json({error: "Answer not found"});
    } else {
      answer.votes -= 1;
      records.save(() => res.status(204).json({}));
    }
  });
});

// EDIT A QUESTION
app.put('/questions/:qID', (req, res) => {
  records.update(req.params.qID, null, req.body, () => {
    if (!req.body) {
      res.status(400).json({error: "Question not found"});
    } else {
      records.save(() => res.status(201).json({}));
    }
  });
});

//EDIT AN ANSWER

app.put('/questions/:qID/answers/:aID', (req, res) => {
  records.update(req.params.qID, req.params.aID, req.body, () => {
    if (!req.body) {
      res.status(400).json({error: "Question not found"});
    } else {
      records.save(() => res.status(201).json({}));
    }
  });
});

//DELETE A QUESTION 

app.delete('/questions/:qID', (req, res) => {
  records.delete(req.params.qID, null, () => {
    records.save(()=> res.status(201).json({}));
  });
});

// DELETE AN ANSWER 
app.delete('/questions/:qID/answers/:aID', (req, res) => {
  records.delete(req.params.qID, req.params.aID, ()=> {
    records.save(() => res.status(201).json({}));
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



