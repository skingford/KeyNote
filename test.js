const fs = require('fs');
const raw = fs.readFileSync('.gemini/antigravity/brain/47c34c2f-5aa4-49d3-8663-fbf5884aaaa5/seed.md', 'utf8');

const blocks = raw.split('***').map(s => s.trim()).filter(Boolean);
const values = [];
for (const block of blocks) {
    const parts = block.split('====');
    console.log("Block length: ", block.length, "parts length: ", parts.length);
    if (parts.length < 2) continue;
}
