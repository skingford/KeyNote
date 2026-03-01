import { db } from './db';
import { cards, reviewLogs } from './schema';
import { eq, lte, and, isNotNull } from 'drizzle-orm';

// SM-2 算法实现
// rating: 0-Again, 3-Hard, 4-Good, 5-Easy
export function calculateNextReview(
	rating: number,
	repetitions: number,
	interval: number,
	easeFactor: number
) {
	let nextRepetitions = repetitions;
	let nextInterval = interval;
	let nextEaseFactor = easeFactor;

	if (rating >= 3) {
		if (repetitions === 0) {
			nextInterval = 1;
		} else if (repetitions === 1) {
			nextInterval = 3;
		} else {
			let multiplier = nextEaseFactor;
			if (rating === 3) multiplier = 1.2;
			if (rating === 5) multiplier = nextEaseFactor * 1.3;
			nextInterval = Math.round(interval * multiplier);
		}
		nextRepetitions++;
	} else {
		nextRepetitions = 0;
		nextInterval = 1;
	}

	nextEaseFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
	if (nextEaseFactor < 1.3) {
		nextEaseFactor = 1.3;
	}

	return {
		interval: nextInterval,
		repetitions: nextRepetitions,
		easeFactor: nextEaseFactor
	};
}

export function getTodayDateString() {
	const today = new Date();
	return today.toISOString().split('T')[0];
}

export function addDays(dateStr: string | null, days: number) {
	const d = dateStr ? new Date(dateStr) : new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().split('T')[0];
}

// 12. 获取今日待复习列表 (due_date <= today)
export function getDueCards() {
	const today = getTodayDateString();

	// Includes cards with due_date <= today, or due_date IS NULL (new cards)
	const due = db.select()
		.from(cards)
		.where(
			lte(cards.due_date, today)
		)
		.all();

	const newCards = db.select()
		.from(cards)
		.where(eq(cards.due_date, '')) // if we initialized it differently
		.all(); // we will handle new cards logic

	// Wait, standard SQL might have NULL for due_date
	return db.query.cards.findMany({
		where: (cards, { lte, or, isNull }) => or(lte(cards.due_date, today), isNull(cards.due_date))
	});
}

// 13 & 14. 记录评分并更新 card 状态
export function processReview(cardId: number, rating: number) {
	const card = db.select().from(cards).where(eq(cards.id, cardId)).get();
	if (!card) throw new Error("Card not found");

	let { repetitions, interval, ease_factor } = card;

	// 14. 新卡片初始化逻辑 (首次学习序列)
	// If it's a new card (due_date is null/empty and interval is 0)
	// SM-2 will handle this because repetitions is 0.

	const nextState = calculateNextReview(rating, repetitions, interval, ease_factor);
	const nextDueDate = addDays(getTodayDateString(), nextState.interval);

	db.transaction(() => {
		db.update(cards)
			.set({
				ease_factor: nextState.easeFactor,
				interval: nextState.interval,
				repetitions: nextState.repetitions,
				due_date: nextDueDate,
				updated_at: new Date()
			})
			.where(eq(cards.id, cardId))
			.run();

		db.insert(reviewLogs)
			.values({
				card_id: cardId,
				rating: rating,
				reviewed_at: new Date()
			})
			.run();
	});

	return nextState;
}
