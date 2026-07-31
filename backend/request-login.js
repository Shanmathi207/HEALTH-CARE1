const http = require('http');
const data = JSON.stringify({ email: 'patient@demo.com', password: 'password123', userType: 'patient' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, res => {
  let body = '';
  console.log('statusCode', res.statusCode);
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('body', body);
  });
});
req.on('error', error => console.error('request error', error));
req.write(data);
req.end();