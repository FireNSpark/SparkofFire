// backend/server.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt || !OPENAI_KEY) return res.status(400).json({ error: 'Missing prompt or API key.' });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "[No response]";
    res.json({ reply: answer });

  } catch (err) {
    console.error("[OpenAI Error]", err);
    res.status(500).json({ error: 'Failed to contact OpenAI.' });
  }
});

app.listen(PORT, () => {
  console.log(`[🔥 Backend Ready] Listening on http://localhost:${PORT}`);
});
