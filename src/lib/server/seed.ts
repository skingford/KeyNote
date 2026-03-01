import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { db } from './db';
import { questions, cards } from './schema';
import { eq } from 'drizzle-orm';

export function parseMarkdown(fileContent: string) {
	const { data, content } = matter(fileContent);

	const parts = content.split(/##\s+答案/i);
	let questionContent = parts[0] || '';
	let answerContent = parts[1] || '';

	questionContent = questionContent.replace(/##\s+问题/i, '').trim();
	answerContent = answerContent.trim();

	return {
		frontmatter: data,
		question: questionContent,
		answer: answerContent
	};
}

export function importSeeds(seedDir: string) {
	const files = getFilesRecursively(seedDir);
	let count = 0;

	for (const file of files) {
		if (!file.endsWith('.md')) continue;

		const content = fs.readFileSync(file, 'utf-8');
		const { frontmatter, question, answer } = parseMarkdown(content);

		const title = frontmatter.title || path.basename(file, '.md');
		const category = frontmatter.category || 'unknown';
		const tags = JSON.stringify(frontmatter.tags || []);
		const difficulty = frontmatter.difficulty || 1;

		// Upsert question (check by title for simplicity)
		const existingQ = db
			.select()
			.from(questions)
			.where(eq(questions.title, title))
			.get();

		let questionId: number;

		if (existingQ) {
			db.update(questions)
				.set({
					content: question,
					answer: answer,
					category,
					tags,
					difficulty
				})
				.where(eq(questions.id, existingQ.id))
				.run();
			questionId = existingQ.id;
		} else {
			const res = db
				.insert(questions)
				.values({
					title,
					content: question,
					answer: answer,
					category,
					tags,
					difficulty,
					created_at: new Date()
				})
				.returning({ id: questions.id })
				.get();
			questionId = res.id;
		}

		// Ensure card exists
		const existingCard = db
			.select()
			.from(cards)
			.where(eq(cards.question_id, questionId))
			.get();

		if (!existingCard) {
			db.insert(cards)
				.values({
					question_id: questionId,
					updated_at: new Date()
				})
				.run();
		}
		count++;
	}

	return count;
}

function getFilesRecursively(dir: string): string[] {
	let results: string[] = [];
	if (!fs.existsSync(dir)) return results;
	const list = fs.readdirSync(dir);

	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			results = results.concat(getFilesRecursively(filePath));
		} else {
			results.push(filePath);
		}
	}

	return results;
}
