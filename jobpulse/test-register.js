const http = require('http');

const postData = JSON.stringify({
  full_name: 'Test User ' + Date.now(),
  email: 'test' + Date.now() + '@example.com',
  phone: '9876543210',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('BODY:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('PARSED:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
