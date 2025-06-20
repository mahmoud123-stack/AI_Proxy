const API_Key = "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";

export default async function handler(req, res) {
  // ✅ إضافة كل Headers الخاصة بـ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ مهم جدًا: لو نوع الـ Request هو OPTIONS → رجّع رد سريع بدون ما تكمل
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // ✅ باقي الكود كالمعتاد
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    res.status(400).json({ error: "Model and prompt are required" });
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
        inputs: prompt,
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
