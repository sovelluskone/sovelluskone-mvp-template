import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Vain POST on sallittu" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt puuttuu" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Olet avulias ohjelmointiapuri, joka kirjoittaa HTML, CSS ja JavaScript koodia.",
        },
        {
          role: "user",
          content: `Luo yksinkertainen web-sovellus seuraavan kuvauksen perusteella: ${prompt}. Vastaa pelkällä koodilla.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 700,
    });

    const code = completion.data.choices[0].message.content;
    res.status(200).json({ code });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response?.data?.error?.message || error.message });
  }
}
