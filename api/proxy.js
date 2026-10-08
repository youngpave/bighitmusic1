export default async function handler(req, res) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Canlı Yayın Oynatıcı</title>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
            body { background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: height; min-height: 100vh; margin: 0; }
            .player-container { width: 100%; max-width: 900px; padding: 20px; }
            video { width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); background: black; }
            h2 { margin-bottom: 15px; font-size: 1.2rem; color: #38bdf8; }
        </style>
    </head>
    <body>
        <div class="player-container">
            <h2>Canlı Yayın Akışı</h2>
            <video id="video" controls autoplay playsinline></video>
        </div>

        <script>
            // Buraya güncel m3u8 linkini veya proxy yönlendirmeni gireceğiz
            var videoSrc = 'https://justkidding.junksonus.party/main/secure/3b0c6167e9a2d4d714940d0a53a431387f41d7f38f1f70da729869f28fe23514/1791443296/beinsports1-tr.m3u8';
            var video = document.getElementById('video');

            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
                video.addEventListener('loadedmetadata',function() {
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
