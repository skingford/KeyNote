import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function load() {
	// Group questions by category and count them
	const counts = await db
		.select({
			category: questions.category,
			count: sql<number>`count(${questions.id})`.mapWith(Number).as('count')
		})
		.from(questions)
		.groupBy(questions.category);

	// Also get total pending reviews (due)
	const now = new Date().getTime();
	
	// Drizzle sqlite returns timestamps as ms when using {mode: timestamp} correctly, but safe to check null
	const due = await db
		.select({ count: sql<number>`count(${questions.id})`.mapWith(Number).as('count') })
		.from(questions)
		.where(sql`${questions.nextReviewAt} <= ${now} OR ${questions.nextReviewAt} IS NULL`);

	return {
		categories: counts,
		dueCount: due[0]?.count || 0
	};
}
