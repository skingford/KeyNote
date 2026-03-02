import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable('questions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	answer: text('answer').notNull(),
	category: text('category').notNull(),
	level: integer('level').notNull().default(0), // 0: 生疏, 1: 模糊, 2: 掌握
	lastReviewedAt: integer('last_reviewed_at', { mode: 'timestamp' }),
	nextReviewAt: integer('next_review_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
