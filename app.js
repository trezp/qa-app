const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const data = require('./data.json');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));


app.get('/questions', (req, res) => res.json(data.questions));

app.get('/questions/:qID', (req, res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.json(question)
    } 
  });
}); 

app.get('/questions/:qID/answers', (req, res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.json(question.answers)
    } 
  });
}); 

app.get('/questions/:qID/answers/:aID', (req, res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      question.answers.forEach( (answer) => {
        if(req.params.aID == answer.answer_id){
          res.json(answer)
        }
      });
    } 
  });
}); 

app.post('/questions', (req, res) => {
  
  data.questions.push({
    "question_id": data.questions.length, 
    "question": req.body.question,
    "answers": []
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
});

app.post('/questions/:qID', ( req, res ) => {
  const questionID = req.params.qID;
  console.log(data.questions.length)

  data.questions[questionID].answers.push({
    "answer_id": `a${data.questions[questionID].answers.length}`, 
    "answer": req.body.answer,
    "votes": 0
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
