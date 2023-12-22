import request from 'supertest';
import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
 import { User } from '../model/userModel';
import {app,server} from '../server';
import connectDb from '../config/dbConnection';
connectDb();

const _id=new mongoose.Types.ObjectId()
const testUser1 = {
  _id: _id,
  username: 'testuser1',
  password: 'testpassword1',
  email: 'testuser1@gmail.com',
  role: 'regular',
  tokens: [{ token: jwt.sign( { userId:"6585669382dba0266388afdc"}, process.env.JWT_SECRET) }],
};
const token = testUser1.tokens[0].token;
beforeAll(done => {
  done()
})

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
let newid="";
test('Register user', async () => {
   const res = await request(app)
    .post('/user/register')
    .send({
      username: 'new1111',
      password: 'new1111',
      email: 'new1111@gmail.com',
    })
    .expect(200)
    //newid = res.body._id;
},10000)
let newtoken = "";
test('Login user', async () => {
  const response  = await request(app)
    .post('/user/login')
    .send({
      username: 'new111',
      password: 'new111',
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
    .send({ username: 'neww111' })
    .expect(200);
});

test('Follow another user', async () => {
  await request(app)
    .post('/user/follow')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ usernametofollow: 'new104' })
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
    .send({ usernametounfollow: 'new104' })
    .expect(200);
});

test('Get followers', async () => {
  await request(app)
    .get('/user/followers')
    .set('Authorization', `Bearer ${newtoken}`)
    .expect(200);
});


/*
test('Upload profile picture', async () => {
  await request(app)
    .post('/user/upload-profile-picture')
    .set('Authorization', `Bearer ${newtoken}`)
    .attach('file', 'C:\Users\Pinky Pamecha\OneDrive\Pictures\Screenshots\Screenshot 2023-08-26 021312')
    .expect(200);
});
*/
test('Change user role', async () => {
  await request(app)
    .put('/user/changerole')
    .set('Authorization', `Bearer ${newtoken}`)
    .send({ role: 'premium' })
    .expect(200);
});



/*
test(
    'send otp',
    async () => {
      const response = await request(app)
        .post('/user/sendotp')
        .send({
          email: 'newuser1@gmail.com',
        })
        .expect(200);
  
      myotp = response.body.otp;
    },
    100000 
  );
*/