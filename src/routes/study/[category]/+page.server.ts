import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { eq, or, isNull, lte, and } from 'drizzle-orm';

export async function load({ params }) {
	const category = params.category;
	const now = new Date();

	// Fetch up to 20 due questions for this category
	const dueQuestions = await db
		.select()
		.from(questions)
		.where(
			and(
				eq(questions.category, category),
				or(lte(questions.due, now), isNull(questions.due))
			)
		)
		.limit(20);

	return {
		category,
		questions: dueQuestions
	};
}
