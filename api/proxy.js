  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Canlı Yayın - Debug</title>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
            body { background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
            .player-container { width: 100%; max-width: 900px; padding: 20px; text-align: center; }
            video { width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); background: black; }
            h2 { margin-bottom: 15px; font-size: 1.2rem; color: #38bdf8; }
            #log { margin-top: 10px; background: #1e293b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; text-align: left; max-height: 150px; overflow-y: auto; color: #f43f5e; }
        </style>
    </head>
    <body>
        <div class="player-container">
            <h2>Superonline Bypass Canlı Yayın</h2>
            <video id="video" controls autoplay playsinline></video>
            <div id="log">Sistem başlatılıyor...</div>
        </div>

        <script>
            function log(msg) {
                console.log(msg);
                document.getElementById('log').innerHTML += '<br>' + msg;
            }

            var rawM3u8 = 'https://justkidding.junksonus.party/main/secure/3b0c6167e9a2d4d714940d0a53a431387f41d7f38f1f70da729869f28fe23514/1791443296/beinsports1-tr.m3u8';
            var videoSrc = '/api/proxy?url=' + encodeURIComponent(rawM3u8);
            var video = document.getElementById('video');

            if (Hls.isSupported()) {
                var hls = new Hls();
                log("HLS.js destekleniyor, kaynak yükleniyor...");
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    log("Manifest başarıyla çözüldü, oynatılıyor!");
                    video.play();
                });

                hls.on(Hls.Events.ERROR, function(event, data) {
                    log("HLS Hata türü: " + data.type + " | Detay: " + data.details);
                });
            } else {
                log("Tarayıcı bu formatı desteklemiyor.");
            }
        </script>
    </body>
    </html>
  `;
