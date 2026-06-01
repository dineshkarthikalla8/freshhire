const fs = require('fs');

const md = fs.readFileSync('SAMPLE_EXAM.md', 'utf8');
const normalized = md.replace(/\r\n/g, '\n').trim();
const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

if (match) {
  const metadataStr = match[1];
  const body = match[2];
  
  const metadata = {};
  metadataStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      const lowerKey = key.trim().toLowerCase();
      if (lowerKey === 'duration' || lowerKey === 'passingscore') {
        metadata[lowerKey] = parseInt(value, 10);
      } else {
        metadata[lowerKey] = value;
      }
    }
  });

  const questionBlocks = body.split('---').map(b => b.trim()).filter(Boolean);
  
  console.log('✓ SUCCESS: Parser works!');
  console.log('✓ Metadata:', JSON.stringify(metadata, null, 2));
  console.log('✓ Questions found:', questionBlocks.length);
} else {
  console.log('✗ FAILED: Could not parse markdown');
  process.exit(1);
}
