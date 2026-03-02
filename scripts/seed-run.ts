import { importSeeds } from '../src/lib/server/seed.js';
import path from 'node:path';

async function main() {
	const seedDir = path.resolve('seed');
	console.log(`Importing seeds from ${seedDir}...`);
	const count = await importSeeds(seedDir);
	console.log(`Successfully imported ${count} questions.`);
}

main().catch(console.error);
