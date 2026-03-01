import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable('questions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	answer: text('answer').notNull(),
	category: text('category').notNull(), // 'go' | 'architecture'
	difficulty: integer('difficulty').default(1), // 1-3
	tags: text('tags').default('[]'), // JSON array
	created_at: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const cards = sqliteTable('cards', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	question_id: integer('question_id')
		.notNull()
		.unique()
		.references(() => questions.id),
	ease_factor: real('ease_factor').default(2.5).notNull(),
	interval: integer('interval').default(0).notNull(),
	repetitions: integer('repetitions').default(0).notNull(),
	due_date: text('due_date'), // YYYY-MM-DD
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const reviewLogs = sqliteTable('review_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	card_id: integer('card_id')
		.notNull()
		.references(() => cards.id),
	rating: integer('rating').notNull(), // 0-5 SM-2 rating
	reviewed_at: integer('reviewed_at', { mode: 'timestamp' }).notNull()
});
