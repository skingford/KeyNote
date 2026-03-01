import { importSeeds } from '../src/lib/server/seed';
import path from 'node:path';

const seedDir = path.resolve('seed');
console.log(`Importing seeds from ${seedDir}...`);
const count = importSeeds(seedDir);
console.log(`Successfully imported ${count} questions.`);
