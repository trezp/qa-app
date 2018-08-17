const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const data = require('./data.json');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));


app.get('/questions', (req, res) => res.json(data.questions));

app.get('/questions/:qID', (req,res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.json(question)
    } 
  });
}); 

app.get('/questions/:qID/answers', (req,res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.json(question.answers)
    } 
  });
}); 

app.get('/questions/:qID/answers/:aID', (req,res) => {
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

app.post('/questions', (req,res) => {
  data.questions.push(req.body);
  console.log(req.body)

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.json(data);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
