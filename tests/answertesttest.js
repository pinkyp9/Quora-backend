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
      username: 'new105',
      password: 'new105',
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
      questionText:'what is cat?' ,
       category:'Science'
    })
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(201);
     questionid = res.body._id; 
},10000);

let answerid="";
test('answer a question', async () => {
  const res = await request(app)
    .post('/answer/uranswer')
    .send({
        content:'animal', questionId:questionid, user:newid 
    })
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(201);
     answerid = res.body._id; 
},10000);

test('display all answers', async () => {
    await request(app)
      .get('/answer/displayallanswer')
      .set('Authorization', `Bearer ${newtoken}`)
      .expect(200);
  });
  
test(' update answer', async () => {
  await request(app)
    .patch('/answer/updateanswer')
    .send({  answerId :answerid,
      content:"it is an animal"
    })
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(201);
});

test('upvote answer', async () => {
  await request(app)
    .patch('/answer/upvoteanswer')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ answerId:answerid })
    .expect(200);
});


test('downupvote answer', async () => {
    await request(app)
      .patch('/answer/downvoteanswer')
      .set('Authorization', `Bearer ${newtoken}`)
      .send({ answerId:answerid })
      .expect(200);
  });





