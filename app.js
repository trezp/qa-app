const express = require('express');
const app = express();
const fs = require('fs');
const data = require('./data.json');


app.get('/', (req, res) => res.json(data.questions));

app.get('/questions/:id', (req,res) => {
  const question = data.questions.filter((result) =>{
    if (req.params.id == result.question_id) {
        return result.question
    } 
  });

  res.json(question);
}); 

app.get('/questions/:id/answers', (req,res) => {
  const answers = data.questions.filter((result) =>{
    if (req.params.id == result.question_id) {
        return result.answers
    } 
  });
  res.json(answers);
}); 

app.post('/questions', (req,res) => {
  data.questions.push(req.body);

  fs.writeFile('data.json', JSON.stringify(data, null, 2));
  res.send(data);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));