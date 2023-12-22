import request from 'supertest';
import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
 import { User } from '../model/userModel';
import {app,server} from '../server';
import connectDb from '../config/dbConnection';
connectDb();

/*const _id=new mongoose.Types.ObjectId()
const testUser1 = {
  _id: _id,
  username: 'testuser1',
  password: 'testpassword1',
  email: 'testuser1@gmail.com',
  role: 'regular',
  tokens: [{ token: jwt.sign( { userId:"6585669382dba0266388afdc"}, process.env.JWT_SECRET) }],
};
const token = testUser1.tokens[0].token;
*/
beforeAll(done => {
  done()
})

afterAll(done => {
  mongoose.connection.close()
  done()
})



let newid="";
let newtoken = "";
test('Register user', async () => {
   const res = await request(app)
    .post('/user/register')
    .send({
      username: 'new11111',
      password: 'new11111',
      email: 'new11111@gmail.com',
    })
    .expect(200)
},10000)

test('Login user', async () => {
  const response  = await request(app)
    .post('/user/login')
    .send({
      username: 'new1111',
      password: 'new1111',
    })
    .expect(200)
  newtoken = response.body.token;
  newid = response.body._id;

},10000);

test('Get my profile', async () => {
  await request(app)
    .get('/user/myprofile')
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(200);
},10000);

test('Get users profile', async () => {
    await request(app)
      .get('/user/profile')
      .send({
        username:'new101'
      })
      .set('Authorization', `Bearer ${newtoken}`)
      .expect(200);
  });

test('Update user profile', async () => {
  await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ username: 'neww1111' })
    .expect(200);
});

test('Follow another user', async () => {
  await request(app)
    .post('/user/follow')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ usernametofollow: 'new101' })
    .expect(200);
});

test('Get following', async () => {
    await request(app)
      .get('/user/following')
      .set('Authorization', `Bearer ${newtoken}`)
      .expect(200);
  });

test('Unfollow another user', async () => {
  await request(app)
    .post('/user/unfollow')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ usernametounfollow: 'new101' })
    .expect(200);
});

test('Get followers', async () => {
  await request(app)
    .get('/user/followers')
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(200);
});

test('Change user role', async () => {
  await request(app)
    .put('/user/changerole')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ role: 'premium' })
    .expect(200);
});

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
  
  