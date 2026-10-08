export default async function handler(req, res) {
  const targetUrl = "https://trend48.st/live-tv?ch=beinsports1-tr";

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Referer": "https://trend48.st/",
        "Origin": "https://trend48.st",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      },
    });

    const contentType = response.headers.get("content-type") || "text/html";
    res.setHeader("Content-Type", contentType);
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    const data = await response.text();
    return res.status(response.status).send(data);

  } catch (error) {
    return res.status(500).json({ error: "Proxy Hata: " + error.message });
  }
}
