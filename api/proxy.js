export default async function handler(req, res) {
  // O anki m3u8 veya video parçasının hedef URL'si (query string'den veya direkt)
  const targetUrl = req.query.url || "https://justkidding.junksonus.party/main/secure/3b0c6167e9a2d4d714940d0a53a431387f41d7f38f1f70da729869f28fe23514/1791443296/beinsports1-tr.m3u8";

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Referer": "https://trend48.st/",
        "Origin": "https://trend48.st",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      },
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Eğer gelen veri m3u8 manifestosu ise, içindeki parça linklerini de bizim proxy'ye yönlendirecek şekilde rewrite edelim
    if (targetUrl.includes(".m3u8")) {
      let bodyText = await response.text();
      
      // m3u8 içindeki göreceli (relative) veya mutlak .ts parça adreslerini Vercel proxy üzerinden geçecek şekilde değiştiriyoruz
      // (Burada temel alan adını baz alarak parçaları proxy'liyoruz)
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
      
      // Satır satır işleyip .ts uzantılı parçaları Vercel proxy'mize yönlendiriyoruz
      const rewrittenLines = bodyText.split("\n").map(line => {
        line = line.trim();
        if (line && !line.startsWith("#")) {
          // Eğer link tam adres değilse tamamla
          const absoluteTsUrl = line.startsWith("http") ? line : baseUrl + line;
          // Bizim Vercel proxy adresimiz üzerinden çağrılmasını sağla
          return `/api/proxy?url=${encodeURIComponent(absoluteTsUrl)}`;
        }
        return line;
      });

      return res.status(200).send(rewrittenLines.join("\n"));
    }

    // Eğer .ts video parçası ise direkt binary olarak aktar
    const data = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(data));

  } catch (error) {
    return res.status(500).json({ error: "Proxy Hata: " + error.message });
  }
}
