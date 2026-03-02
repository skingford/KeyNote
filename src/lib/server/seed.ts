import fs from 'node:fs';
import path from 'node:path';
import { db } from './db/index.js';
import { questions } from './db/schema.js';

export async function importSeeds(seedDir: string): Promise<number> {
	const records: any[] = [];

	function walk(dir: string) {
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const filepath = path.join(dir, file);
			const stat = fs.statSync(filepath);
			if (stat.isDirectory()) {
				walk(filepath);
			} else if (file.endsWith('.md') && file !== 'Seed.md') {
				const content = fs.readFileSync(filepath, 'utf-8');
				const parsed = parseMarkdown(content);
				if (parsed) {
					records.push(parsed);
				}
			}
		}
	}

	walk(seedDir);

	if (records.length > 0) {
		await db.insert(questions).values(records);
	}

	return records.length;
}

function parseMarkdown(raw: string) {
	// Simple frontmatter parsing
	const parts = raw.split('---');
	if (parts.length < 3) return null;

	const metaRaw = parts[1];
	const body = parts.slice(2).join('---').trim();

	let title = '无标题';
	let category = '未分类';

	metaRaw.split('\n').forEach(line => {
		const l = line.trim();
		if (l.startsWith('title:')) title = l.substring(6).trim();
		if (l.startsWith('category:')) category = l.substring(9).trim();
	});

	// Split body into question and answer
	const qMatch = body.match(/## 问题\s+([\s\S]*?)(?=## 答案)/);
	const aMatch = body.match(/## 答案\s+([\s\S]*)/);

	const questionContent = qMatch ? qMatch[1].trim() : body;
	const answerContent = aMatch ? aMatch[1].trim() : '暂无答案';

	return { title, category, content: questionContent, answer: answerContent };
}
