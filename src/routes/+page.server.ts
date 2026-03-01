import { db } from '$lib/server/db';
import { questions, cards } from '$lib/server/schema';
import { eq, lte, or, isNull } from 'drizzle-orm';
import { getTodayDateString } from '$lib/server/srs';

export async function load() {
	const today = getTodayDateString();

	const dueCards = db
		.select({
			category: questions.category
		})
		.from(cards)
		.innerJoin(questions, eq(cards.question_id, questions.id))
		.where(or(lte(cards.due_date, today), isNull(cards.due_date)))
		.all();

	const totalDue = dueCards.length;
	
	const stats = dueCards.reduce((acc, card) => {
		acc[card.category] = (acc[card.category] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return {
		totalDue,
		stats
	};
}
