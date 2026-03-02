import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
	const { id, level } = await request.json();
	// Simple spaced repetition logic: level 0 = +12h, level 1 = +3d, level 2 = +7d
	const now = new Date();
	const nextReview = new Date(now);

	if (level === 0) {
		nextReview.setHours(nextReview.getHours() + 12);
	} else if (level === 1) {
		nextReview.setDate(nextReview.getDate() + 3);
	} else {
		nextReview.setDate(nextReview.getDate() + 7);
	}

	await db.update(questions).set({
		level,
		lastReviewedAt: now,
		nextReviewAt: nextReview
	}).where(eq(questions.id, id));

	return json({ success: true, nextReviewAt: nextReview });
}
