const express = require('express');
const records = require('./records');

const app = express();

app.use(express.json());

// HELPER FUNCTIONS
function asyncHandler(middleware){
  return async (req, res, next)=>{
    try {
      await middleware(req,res, next);
    } catch(err){
      next(err);
    }
  };
}

async function validateQuestion(req, res, next){
  try {
    const question = await records.getQuestion(req.params.qID);
    if(!question){
      res.status(404).json({error: "Question not found"});
    } else {
      req.question = question;
      next();
    }
  } catch(err){
    next(err);
  }
}
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

// GET one question 

// app.get('/questions/:qID', async (req, res, next) => {
//   try {
//     const question = await records.getQuestion(req.params.qID, next);
//     res.json(question);
//   } catch(err) {
//     next(err);
//   }
// }); 

app.get('/questions/:qID', asyncHandler( async (req,res)=>{
  const question = await records.getQuestion(req.params.qID);
  res.json(question);
})); 


// POST Create a new question
app.post('/questions', asyncHandler(async(req, res, next) => {

  if(!req.body.question){
    res.status(400).json({error: "Expecting a question."});
  } else {
    const question = await records.createQuestion(req.body.question);
    res.status(201).json(question);
  }
}));

// // POST a new answer
app.post('/questions/:qID/answers', asyncHandler(async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);

  if (!question){
    next();
  } else if(!req.body.answer){
    res.status(400).json({error: "Expecting an answer."});
  } else {
    await records.createAnswer(question, req.body.answer);
    res.status(201).json(question);
  }
}));

// // Vote up an answer up
app.post('/questions/:qID/answers/:aID/vote-up', asyncHandler(async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);
  const answer = await records.getAnswer(question, req.params.aID);

  if(!question){
    res.status(404).json({error: "Question not found"});
  } else {
    await records.voteUp(answer);
    res.status(204).end();
  }
}));

// // Vote an answer down 
app.post('/questions/:qID/answers/:aID/vote-down', asyncHandler(async (req, res, next) => {
  const question = await records.getQuestion(req.params.qID);
  const answer = await records.getAnswer(question, req.params.aID);

  if(!answer){
    res.status(404).json({error: "Answer not found"});
  } else {
    await records.voteDown(answer);
    res.status(204).end();
  }
}));

// // EDIT A QUESTION
app.put('/questions/:qID', validateQuestion, asyncHandler(async (req, res, next) => {
  await records.editQuestion(req.question, req.body);
  res.status(204).end();
}));

// //EDIT AN ANSWER

// app.put('/questions/:qID/answers/:aID', validateQuestion, async (req, res, next) => {
//   const answer = await records.getAnswer(req.params.qID, req.params.aID);

//   if(!answer){
//     res.status(404).json({error: "Question not found"});
//   } else {
//     try {
//       await records.editAnswer(answer, req.body);
//       res.status(204).end();
//     } catch(err){
//       next(err);
//     }
//   }
// });

app.put('/questions/:qID/answers/:aID', validateQuestion, asyncHandler(async(req,res)=>{
  await records.editAnswer(req.question, req.params.aID, req.body.answer);
  res.status(204).end();
}))

// //DELETE A QUESTION 
// app.delete('/questions/:qID', validateQuestion, async (req, res, next) => {
//   try {
//     await records.deleteQuestion(req.question);
//     res.status(204).end();
//   } catch(err){
//     next(err);
//   }
// });

// // // DELETE AN ANSWER 
// app.delete('/questions/:qID/answers/:aID', validateQuestion, async (req, res, next) => {
//   const answer = await records.getAnswer(req.params.qID, req.params.aID);

//   if (!answer){
//     res.status(404).json({error: "Answer not found"});
//   } else {
//     try {
//       await records.deleteAnswer(req.question, answer);
//       res.status(204).end();
//     } catch(err){
//       next(err);
//     }
//   }
// });

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
