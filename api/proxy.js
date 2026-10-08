export default async function handler(req, res) {
  // Ham m3u8 yayın adresimiz
  const targetUrl = "https://justkidding.junksonus.party/main/secure/3b0c6167e9a2d4d714940d0a53a431387f41d7f38f1f70da729869f28fe23514/1791443296/beinsports1-tr.m3u8";

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Referer": "https://trend48.st/",
        "Origin": "https://trend48.st",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      },
    });

    // M3U8 veya ts parçaları için içerik türünü (content-type) doğru yansıtıyoruz
    const contentType = response.headers.get("content-type") || "application/vnd.apple.mpegurl";
    res.setHeader("Content-Type", contentType);
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    const data = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(data));

  } catch (error) {
    return res.status(500).json({ error: "Proxy Hata: " + error.message });
  }
}
