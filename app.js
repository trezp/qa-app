const express = require('express');
const records = require('./records');

const app = express();

app.use(express.json());

// GET all questions
app.get('/questions', async (req, res, next) => {
  try {
    const allRecords = await records.getAll(); 
    if(!allRecords){
      next();
    } else {
      res.json(allRecords);
    }
  } catch(err) {
    next(err);
  }
});

// GET specific question
app.get('/questions/:qID', async (req, res, next) => {
  try {
    const question = await records.getQuestion(req.params.qID, next);
    res.json(question);
  } catch(err) {
    next(err);
  }
}); 

// POST Create a new question
app.post('/questions', async (req, res, next) => {

  if(!req.body.question){
    res.status(400).json({error: "Expecting a question."});
  } else {
    try {
      const question = await records.createQuestion(req.body.question);
      res.status(201).json(question);
    } catch(err) {
      next(err);
    }
  }
});

// POST a new answer
app.post('/questions/:qID/answers', async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);

  if (!question){
    next();
  } else if(!req.body.answer){
    res.status(400).json({error: "Expecting an answer."});
  } else {
    try {
      await records.createAnswer(question, req.body.answer);
      res.status(201).json(question);
    } catch(err) {
      next(err);
    }
  }
});

// Vote up an answer up
app.post('/questions/:qID/answers/:aID/vote-up', async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);
  const answer = await records.getAnswer(question, req.params.aID);

  if(!question){
    res.status(404).json({error: "Question not found"});
  } else {
    try {
      await records.voteUp(answer);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
});

// Vote an answer down 
app.post('/questions/:qID/answers/:aID/vote-down', async (req, res, next) => {
  const answer = await records.getAnswer(req.params.qID, req.params.aID);

  if(!answer){
    res.status(404).json({error: "Answer not found"});
  } else {
    try {
      await records.voteDown(answer);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
});

// EDIT A QUESTION
app.put('/questions/:qID', async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);
  
  if(!question){
    res.status(404).json({error: "Question not found"});
  } else {
    try {
      await records.editQuestion(question, req.body);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
});

//EDIT AN ANSWER

app.put('/questions/:qID/answers/:aID', async (req, res, next) => {
  const answer = await records.getAnswer(req.params.qID, req.params.aID);

  if(!answer){
    res.status(404).json({error: "Question not found"});
  } else {
    try {
      await records.editAnswer(answer, req.body);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
});

//DELETE A QUESTION 
app.delete('/questions/:qID', async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);

  if (!question){
    res.status(404).json({error: "Question not found"});
  } else {
    try {
      await records.deleteQuestion(question);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
});

// // DELETE AN ANSWER 
app.delete('/questions/:qID/answers/:aID', async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);
  const answer = await records.getAnswer(req.params.qID, req.params.aID);

  if (!answer){
    res.status(404).json({error: "Answer not found"});
  } else {
    try {
      await records.deleteAnswer(question, answer);
      res.status(204).end();
    } catch(err){
      next(err);
    }
  }
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


//Questions for James/To dos: 
// I need to make sure that the question exists AND that they've provided an answer...
  // If the keys aren't right when a question or answer is posted/updated, that property
  // simply disappears 
// What should I expect from the client? Just the answer body, or an object?
// Should this route just be to the question id, or to qID/answers? 
// overall project structure
// double check best practices to export functions from exports.js
// comment code, ask James about writing documentation for the module
