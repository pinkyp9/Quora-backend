import request from 'supertest';
import dotenv from "dotenv";
dotenv.config();
import {app,server} from '../server';
import connectDb from '../config/dbConnection';
connectDb();


let newid;
let newtoken = "";
test('Login user', async () => {
  const response  = await request(app)
    .post('/user/login')
    .send({
      username: 'new104',
      password: 'new104',
    })
    .expect(200)
  newtoken = response.body.token;
  newid = response.body._id;

},10000);
let questionid="";
test('create question', async () => {
  const res = await request(app)
    .post('/question/askQuestion')
    .send({
      questionText:'what is h?' ,
       category:'Science'
    })
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(201);
     questionid = res.body._id; 
},10000);

test(' update questions text', async () => {
    await request(app)
      .put('/question/updateQuestion')
      .send({
        questionId :questionid, questionText:"what is hormones??"
      })
      .set('Authorization', `Bearer ${newtoken}`)
      .expect(200);
  });
  
test(' update questions category', async () => {
  await request(app)
    .put('/question/updateQuestion')
    .send({
      questionId :questionid, category:"Arts"
    })
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(200);
});

test('get questions category wise ', async () => {
  await request(app)
    .get('/question/getcategoryquestions')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ category: 'Science' })
    .expect(201);
});

test('get all answers to a question', async () => {
  await request(app)
    .get('/question/getallanswers')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ questionId: questionid })
    .expect(201);
});



