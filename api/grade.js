export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST required" });
  }

  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ message: "No answer provided" });
  }

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are grading an electrical exam answer. Respond with either Correct or Incorrect and a short explanation."
          },
          {
            role: "user",
            content: answer
          }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }

}
