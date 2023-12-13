import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', async (req, res) => {
    try {
      const prompt = req.body.prompt;
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${prompt}`,
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      res.status(200).send({
        bot: response.choices[0].text,
      });
    } catch (error) {
      console.error(error);
  
      // Check for insufficient_quota error
      if (error.code === 'insufficient_quota') {
        res.status(402).send({
          error: 'Insufficient quota. Please consider upgrading your plan.',
        });
      } else {
        res.status(500).send('Something went wrong');
      }
    }
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));
