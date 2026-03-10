const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

console.log('Starting server...');
console.log('PORT:', PORT);
console.log('dirname:', __dirname);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend running on port ${PORT}`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
});