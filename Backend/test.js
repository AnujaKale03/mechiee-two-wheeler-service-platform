const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "What services do you provide?",
    });

    console.log(response.output_text);
  } catch (err) {
    console.log(err.message);
  }
}

test();