import Groq from 'groq-sdk';

// const API_URL = 'https://api.red-pill.ai/v1/chat/completions';
// const API_KEY = import.meta.env.VITE_REDPILL_API_KEY; 

// console.log('API_KEY:', API_KEY);

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

console.log('GROQ_API_KEY:', import.meta.env.VITE_GROQ_API_KEY);

export async function getSuggestions(prompt: string, fileContent: string): Promise<string[]> {
  console.log('getSuggestions called with prompt:', prompt);
  try {
    console.log('Sending request to Groq AI');
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a Solidity code assistant. Provide only Solidity code snippets as suggestions, no explanations.' },
        { role: 'user', content: `Solidity file content:\n${fileContent}\n\nProvide a Solidity code suggestion to complete or continue this line: ${prompt}` }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 50,
      n: 1
    });

    console.log('Response received from Groq AI:', chatCompletion);

    const suggestion = chatCompletion.choices[0].message.content.trim();
    console.log('Solidity suggestion:', suggestion);
    
    return [suggestion];
  } catch (error: any) {
    if (error instanceof Groq.APIError) {
      console.error('Groq API Error:', error.status, error.name, error.message);
    } else {
      console.error('Error fetching Solidity suggestions from Groq AI:', error);
    }
    return [];
  }
}