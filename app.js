const express = require('express');
const records = require('./records');

const app = express();

app.use(express.json());

// GET all questions
app.get('/questions', (req, res) => res.json(records.getAll()));

// GET specific question
app.get('/questions/:qID', (req, res, next) => {
  const question = records.getQuestion(req.params.qID);
  if (!question){
    next();
  } else {
    res.json(question);
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

  // I need to make sure that the question exists AND that they've provided an answer
  // What should I expect from the client? Just the answer body, or an object?
  // Should this route just be to the question id, or to qID/answers? 
  if (!question || !req.body.answer){
    next();
  } else {
    try {
      await records.createAnswer(req.body.answer, req.params.qID);
      res.status(201).json(question);
    } catch(err) {
      next(err);
    }
  }
});

// Vote up an answer up
app.post('/questions/:qID/answers/:aID/vote-up', (req, res) => {
  records.fetchAnswer(req.params.qID, req.params.aID, (answer) => {
    if (!answer){
      res.status(404).json({error: "Answer not found"});
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
      res.status(404).json({error: "Answer not found"});
    } else {
      answer.votes -= 1;
      records.save(() => res.status(204).json({}));
    }
  });
});

// EDIT A QUESTION
app.put('/questions/:qID', (req, res) => {
  
  // attempt to get record
  // if record isn't returned, return 404

  // check for body before update
  records.update(req.params.qID, null, req.body, () => {
    if (!req.body) {
      res.status(400).json({error: "Expected a question"});
    } else {
      records.save(() => res.status(204).end());
    }
  });
});

//EDIT AN ANSWER

app.put('/questions/:qID/answers/:aID', (req, res) => {
  // attempt to get question 
  // attempt to get answer
  // if record isn't returned, return 404

  records.update(req.params.qID, req.params.aID, req.body, () => {
    if (!req.body) {
      res.status(400).json({error: "Expected a question"});
    } else {
      records.save(() => res.status(204).end());
    }
  });
});

//DELETE A QUESTION 

app.delete('/questions/:qID', (req, res) => {
  // check for question 

  records.delete(req.params.qID, null, () => {
    records.save(()=> res.status(204).end());
  });
});

// DELETE AN ANSWER 
  //check for answer 


app.delete('/questions/:qID/answers/:aID', (req, res) => {
  records.delete(req.params.qID, req.params.aID, ()=> {
    records.save(() => res.status(204).end());
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



