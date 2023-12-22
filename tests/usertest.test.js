import { request } from 'supertest';
import { jwt } from 'jsonwebtoken';
import mongoose from 'mongoose';
//import { User } from '../model/userModel';
import { app } from 'express';
import connectDb from '../config/dbConnection';
connectDb();
const testUser1 = {
  _id: new mongoose.Types.ObjectId(),
  username: 'testuser1',
  password: 'testpanpmssword1',
  email: 'testuser1@gmail.com',
  role: 'regular',
  tokens: [{ token: jwt.sign( { userId:_id }, process.env.JWT_SECRE) }],
};

const token = testUser1.tokens[0].token;

test("send otp",async()=>{
    await request(app)
    .post('/user/sendotp')
    .send({
        email : 'newuser@gmail.com'
    })
    .expect(200);
})

test('Register user', async () => {
  await request(app)
    .post('/user/register')
    .send({
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@gmail.com',
    })
    .expect(200);
});

test('Login user', async () => {
  await request(app)
    .post('/user/login')
    .send({
      username: 'testuser1',
      password: 'testpassword1',
    })
    .expect(200);
});

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
