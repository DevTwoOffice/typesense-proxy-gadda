import express from "express";
import fetch from "node-fetch";

const app = express();

// Parse JSON bodies
app.use(express.json());

app.use(async (req, res) => {
  try {
    const targetBase = "http://35.154.33.213:8108";
    const targetUrl = targetBase + req.originalUrl;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        "x-typesense-api-key": process.env.TYPESENSE_API_KEY,
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Typesense proxy running on port ${PORT}`);
});
