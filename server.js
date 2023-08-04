const express = require('express');
require("dotenv").config();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");

async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
    
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        n: n
      });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion
    } else {
      return false
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle incoming requests to the /convert route
app.post('/convert', async (req, res) => {
  try {
    const {code, language } = req.body;
    
    let response = await generateCompletion(`Convert the following code:-  ${code} to:\n${language} code. \n if the code is incorrect or not complate please make gusses and complete it.`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
// Handle incoming requests to the /debug route
app.post('/debug', async (req, res) => {
  try {
    const {code} = req.body;
    
    let response = await generateCompletion(`Debug the following code:-  ${code} \n please check if there is any error and also correct it. also if it's correct provide steps what code is doing and how we can improve it`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
// Handle incoming requests to the /quality route
app.post('/quality', async (req, res) => {
  try {
    const {code} = req.body;
    
    let response = await generateCompletion(`Check the quality of the following code:-  ${code} \n please provide detailed info and also provide some tips to improve. provide in points`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
