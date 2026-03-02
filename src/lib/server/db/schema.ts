import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const questions = sqliteTable('questions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	answer: text('answer').notNull(),
	category: text('category').notNull(),
	
	// FSRS Algorithm Fields
	state: integer('state').notNull().default(0), // 0: New, 1: Learning, 2: Review, 3: Relearning
	due: integer('due', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	stability: real('stability').notNull().default(0),
	difficulty: real('difficulty').notNull().default(0),
	elapsed_days: integer('elapsed_days').notNull().default(0),
	scheduled_days: integer('scheduled_days').notNull().default(0),
	reps: integer('reps').notNull().default(0),
	lapses: integer('lapses').notNull().default(0),
	last_review: integer('last_review', { mode: 'timestamp' }),

	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
