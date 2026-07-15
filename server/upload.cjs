const http = require('http');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = '/home/ashfaq/studio/public/images/reviews';

const HTML = `<!DOCTYPE html>
<html><head><title>Upload Reviews</title>
<style>
body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f0ee;margin:0}
.box{background:white;padding:40px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center;max-width:400px;width:90%}
h2{color:#4B4141;margin-bottom:20px}
input[type=file]{margin:10px 0;padding:10px;border:2px dashed #B79FA0;border-radius:8px;width:100%;cursor:pointer}
button{background:#B79FA0;color:white;border:none;padding:12px 30px;border-radius:8px;font-size:16px;cursor:pointer;margin-top:15px}
button:hover{background:#8F7477}
.msg{margin-top:15px;color:green;font-weight:bold}
</style></head><body>
<div class="box">
<h2>Upload Review Images</h2>
<form id="f">
<input type="file" name="files" multiple accept="image/*" id="fi"><br>
<button type="submit">Upload</button>
</form>
<div class="msg" id="msg"></div>
</div>
<script>
document.getElementById('f').onsubmit=async(e)=>{e.preventDefault();
const fd=new FormData();document.getElementById('fi').files.forEach(f=>fd.append('files',f));
const r=await fetch('/upload-reviews',{method:'POST',body:fd});
const d=await r.json();document.getElementById('msg').textContent=d.message;};
</script></body></html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/upload-reviews') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
  } else if (req.method === 'POST' && req.url === '/upload-reviews') {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      const buf = Buffer.concat(body);
      const boundary = req.headers['boundary'] || req.headers['content-type'].split('boundary=')[1];
      if (!boundary) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({message:'No boundary'})); return; }
      
      const parts = buf.toString('binary').split('--' + boundary);
      let count = 0;
      parts.forEach(part => {
        const match = part.match(/filename="(.+?)"/);
        if (match) {
          const filename = match[1];
          const headerEnd = part.indexOf('\r\n\r\n') + 4;
          const data = part.substring(headerEnd).replace(/\r\n$/, '');
          fs.writeFileSync(path.join(UPLOAD_DIR, filename), data, 'binary');
          count++;
        }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: count + ' image(s) uploaded successfully!' }));
    });
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(3001, () => console.log('Upload server on http://localhost:3001/upload-reviews'));
