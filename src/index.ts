import dotenv from 'dotenv';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import loginHandler from '@/handlers/loginHandler';
import logoutHandler from '@/handlers/logoutHandler';
import registerHandler from '@/handlers/registerHandler';
import userInfoHandler from '@/handlers/userInfoHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: ['https://localhost:3000', 'https://localhost:3002', 'https://localhost:3003'],
    credentials: true,
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.post('/login', loginHandler);
app.post('/logout', logoutHandler);
app.post('/register', registerHandler);
app.get('/profile', userInfoHandler);

app.listen(PORT, () => {
  console.log(`API disponível em http://localhost:${PORT}`);
});
