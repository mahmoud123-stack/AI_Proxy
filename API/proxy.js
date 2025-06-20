import Cors from "micro-cors";

const cors = Cors();

const API_Key = "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";

async function handler(req, res) {
  const { model, input, options } = req.body;

  if (!model || !input) {
    res.status(400).json({ error: "Model and inputs are required" });
    return;
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_Key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: input,
        options: options || {},
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    res.status(response.status).send(text);
    return;
  }

  const buffer = await response.arrayBuffer();
  res.setHeader("Content-Type", "image/png");
  res.send(Buffer.from(buffer));
}

export default cors(handler);
