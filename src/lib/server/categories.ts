import { sql } from 'drizzle-orm';
import { db } from './db';

export async function ensureCategoriesTable() {
	await db.run(sql`
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
		)
	`);
}

export async function syncCategoriesFromQuestions() {
	await ensureCategoriesTable();
	await db.run(sql`
		INSERT OR IGNORE INTO categories (name)
		SELECT DISTINCT category
		FROM questions
		WHERE trim(category) <> ''
	`);
}
