import request from 'supertest';
import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
//const dotenv=require('dotenv').config()
import mongoose from 'mongoose';
// import { User } from '../model/userModel';
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
  tokens: [{ token: jwt.sign( { userId:_id }, process.env.JWT_SECRET) }],
};
const token = testUser1.tokens[0].token;

let myotp;

test("send otp",async(done)=>{
    const response = await request(app)
    .post('/user/sendotp')
    .send({        
        email : 'newuser1@gmail.com'
    })
    .expect(200);
    myotp = response.body.otp;
},100000
)

test('Register user', async () => {
 const res =  await request(app)
    .post('/user/register')
    .send({
      username: 'newuser1',
      password: 'newpassword',
      email: 'newuser1@gmail.com',
      otp: myotp
    })
    .expect(200)
},10000);

test('Login user', async () => {
  await request(app)
    .post('/user/login')
    .send({
      username: 'testuser1',
      password: 'testpassword1',
    })
    .expect(200)
});
/** 
test('Get my profile', async () => {
  await request(app)
    .get('/user/myprofile')
    .set('AuthenticateUser', `Bearer ${token}`)
    .expect(200);
});

test('Get users profile', async () => {
    await request(app)
      .get('/user/profile')
      .send({
        username:'newuser'
      })
      .set('AuthenticateUser', `Bearer ${token}`)
      .expect(200);
  });

test('Update user profile', async () => {
  await request(app)
    .put('/user/update')
    .set('AuthenticateUser', `Bearer ${token}`)
    .send({ username: 'updatedusername' })
    .expect(200);
});

test('Follow another user', async () => {
  await request(app)
    .post('/user/follow')
    .set('AuthenticateUser', `Bearer ${token}`)
    .send({ usernametofollow: 'newuser' })
    .expect(200);
});

test('Get following', async () => {
    await request(app)
      .get('/user/following')
      .set('AuthenticateUser', `Bearer ${token}`)
      .expect(200);
  });

test('Unfollow another user', async () => {
  await request(app)
    .post('/user/unfollow')
    .set('AuthenticateUser', `Bearer ${token}`)
    .send({ usernametounfollow: 'newuser' })
    .expect(200);
});

test('Get followers', async () => {
  await request(app)
    .get('/user/followers')
    .set('AuthenticateUser', `Bearer ${token}`)
    .expect(200);
});



test('Upload profile picture', async () => {
  await request(app)
    .post('/user/upload-profile-picture')
    .set('AuthenticateUser', `Bearer ${token}`)
    .attach('profilePicture', 'path/to/image.jpg')
    .expect(200);
});

test('Change user role', async () => {
  await request(app)
    .put('/user/changerole')
    .set('AuthenticateUser', `Bearer ${token}`)
    .send({ role: 'premium' })
    .expect(200);
});
*/
