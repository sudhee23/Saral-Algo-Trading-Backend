const { exec } = require('child_process');

console.log('Initializing database...');

exec('curl -X POST http://127.0.0.1:8787/init-db', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
  console.log('Database initialization response:', stdout);
}); 