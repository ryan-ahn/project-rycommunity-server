const axios = require('axios');
const config = require('../config');

const sendChatCompletionsService = async (
  system,
  assistant,
  prompt,
  temperature,
) => {
  const systemCompletions = [];
  for (let i = 0; i < system.length; i++) {
    systemCompletions.push(system[i].text);
  }
  const messages = [
    {
      role: 'system',
      content: systemCompletions.join(),
    },
  ];
  if (assistant && assistant.length > 0) {
    for (let i = 0; i < assistant.length; i++) {
      messages.push({ role: 'user', content: assistant[i].question });
      messages.push({
        role: 'assistant',
        content: assistant[i].answer,
      });
    }
  }
  messages.push({
    role: 'user',
    content: prompt,
  });
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages,
      temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${config.gptSecretKey}`,
      },
    },
  );
  const data = {
    prompt,
    answer: response.data.choices[0].message.content,
  };
  return data;
};

module.exports = {
  sendChatCompletionsService,
};
