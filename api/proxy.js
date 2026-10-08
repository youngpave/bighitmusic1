export default async function handler(req, res) {
  // 1. Eğer istek bir m3u8 veya .ts parçası için geliyorsa (Proxy Mantığı)
  if (req.query.url) {
    const targetUrl = req.query.url;

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

      // Eğer gelen veri m3u8 listesi ise, içindeki .ts parça yollarını bizim proxy'ye yönlendir
      if (targetUrl.includes(".m3u8")) {
        let bodyText = await response.text();
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
        
        const rewrittenLines = bodyText.split("\n").map(line => {
          line = line.trim();
          if (line && !line.startsWith("#")) {
            const absoluteTsUrl = line.startsWith("http") ? line : baseUrl + line;
            return `/api/proxy?url=${encodeURIComponent(absoluteTsUrl)}`;
          }
          return line;
        });

        return res.status(200).send(rewrittenLines.join("\n"));
      }

      // Eğer parça (.ts) dosyası ise direkt binary olarak aktar
      const data = await response.arrayBuffer();
      return res.status(response.status).send(Buffer.from(data));

    } catch (error) {
      return res.status(500).json({ error: "Proxy Hata: " + error.message });
    }
  }

  // 2. Eğer ilk kez ana sayfaya giriliyorsa, HLS oynatıcı arayüzünü göster
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Canlı Yayın - Mini VPN Proxy</title>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
            body { background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
            .player-container { width: 100%; max-width: 900px; padding: 20px; text-align: center; }
            video { width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); background: black; }
            h2 { margin-bottom: 15px; font-size: 1.2rem; color: #38bdf8; }
        </style>
    </head>
    <body>
        <div class="player-container">
            <h2>Superonline Bypass Canlı Yayın</h2>
            <video id="video" controls autoplay playsinline></video>
        </div>

        <script>
            // Senin verdiğin mantıkla m3u8 adresini Vercel proxy üzerinden çağırıyoruz
            var rawM3u8 = 'https://justkidding.junksonus.party/main/secure/3b0c6167e9a2d4d714940d0a53a431387f41d7f38f1f70da729869f28fe23514/1791443296/beinsports1-tr.m3u8';
            var videoSrc = '/api/proxy?url=' + encodeURIComponent(rawM3u8);
            
            var video = document.getElementById('video');

            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
                video.addEventListener('loadedmetadata', function() {
                    video.play();
                });
            }
        </script>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(htmlContent);
}
