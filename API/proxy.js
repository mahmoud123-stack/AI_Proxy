const API_Key = "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";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ لو الـ request نوعه OPTIONS = preflight → لازم ترجع رد فاضي
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // 1. استقبل الموديل و الـ prompt من الـ body
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    res.status(400).json({ error: "Model and prompt are required" });
    return;
  }

  // 2. ابعت request لـ Hugging Face للـ model اللي المستخدم اختاره
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer {API_Key}`,
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

  // 3. رجّع الصورة للمستخدم
  const buffer = await response.arrayBuffer();
  res.setHeader("Content-Type", "image/png");
  res.send(Buffer.from(buffer));
}
