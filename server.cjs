const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');
console.log('Looking for dist at:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('Files in /app:', fs.readdirSync('/app'));

app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index from:', indexPath);
  console.log('index.html exists:', fs.existsSync(indexPath));
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend running on port ${PORT}`);
});