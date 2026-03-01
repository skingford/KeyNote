import { getDueCards, processReview } from '$lib/server/srs';
import { db } from '$lib/server/db';
import { questions, cards } from '$lib/server/schema';
import { eq, lte, or, isNull } from 'drizzle-orm';
import { getTodayDateString } from '$lib/server/srs';

export async function load({ url }) {
	const today = getTodayDateString();
	
	const allDueCards = db
		.select({
			cardId: cards.id,
			questionId: questions.id,
			title: questions.title,
			content: questions.content,
			answer: questions.answer,
			category: questions.category,
			tags: questions.tags,
			interval: cards.interval
		})
		.from(cards)
		.innerJoin(questions, eq(cards.question_id, questions.id))
		.where(or(lte(cards.due_date, today), isNull(cards.due_date)))
		.all();

	// filter by query params (tags or category)
	const tagQuery = url.searchParams.get('tags');
	let filteredCards = allDueCards;
	if (tagQuery) {
		const tagsToFilter = tagQuery.split(',');
		filteredCards = allDueCards.filter(c => {
			try {
				const cardTags = JSON.parse(c.tags || '[]');
				return tagsToFilter.some(t => cardTags.includes(t));
			} catch(e) { return false; }
		});
	}

	return {
		cards: filteredCards,
		totalDue: filteredCards.length
	};
}

export const actions = {
	rate: async ({ request }) => {
		const data = await request.formData();
		const cardId = Number(data.get('cardId'));
		const rating = Number(data.get('rating'));

		if (!isNaN(cardId) && !isNaN(rating)) {
			processReview(cardId, rating);
		}

		return { success: true };
	}
};
