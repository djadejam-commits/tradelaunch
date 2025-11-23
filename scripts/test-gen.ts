async function testGenerate() {
  console.log('Sending POST request to /api/generate...\n');

  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessName: 'Speedy Sparks Electrician',
      city: 'Denver',
      trade: 'Electrical',
    }),
  });

  const data = await response.json();

  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

testGenerate().catch(console.error);
