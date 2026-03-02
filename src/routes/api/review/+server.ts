import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fsrs, createEmptyCard, Rating, type Card } from 'ts-fsrs';

export async function POST({ request }) {
	const { id, rating } = await request.json(); // rating: 1(Again), 2(Hard), 3(Good), 4(Easy)
	
	const [question] = await db.select().from(questions).where(eq(questions.id, id));
	if (!question) {
		return json({ error: 'Question not found' }, { status: 404 });
	}

	const f = fsrs();
	const now = new Date();
	
	// Reconstruct FSRS card from DB
	const card: Card = {
		due: question.due,
		stability: question.stability,
		difficulty: question.difficulty,
		elapsed_days: question.elapsed_days,
		scheduled_days: question.scheduled_days,
		reps: question.reps,
		lapses: question.lapses,
		state: question.state,
		last_review: question.last_review || undefined
	};

	// Calculate next card state
	const nextState = f.next(card, now, rating as Rating);
	const nextCard = nextState.card;

	await db.update(questions).set({
		due: nextCard.due,
		stability: nextCard.stability,
		difficulty: nextCard.difficulty,
		elapsed_days: nextCard.elapsed_days,
		scheduled_days: nextCard.scheduled_days,
		reps: nextCard.reps,
		lapses: nextCard.lapses,
		state: nextCard.state,
		last_review: nextCard.last_review
	}).where(eq(questions.id, id));

	return json({ success: true, nextReviewAt: nextCard.due });
}
