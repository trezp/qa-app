const express = require('express');
const app = express();
const fs = require('fs');
const data = require('./data.json');


app.get('/questions', (req, res) => res.json(data.questions));

app.get('/questions/:qID', (req,res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
        res.send(question)
    } 
  });
}); 

app.get('/questions/:qID/answers', (req,res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.send(question.answers)
    } 
  });
}); 

app.get('/questions/:qID/answers/:aID', (req,res) => {
  data.questions.forEach((question) =>{
    if (req.params.qID == question.question_id) {
      res.send(question.answers)
    } 
  });
}); 

app.post('/questions', (req,res) => {
  data.questions.push(req.body);

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.send(data);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
