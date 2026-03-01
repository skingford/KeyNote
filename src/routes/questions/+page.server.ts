import { db } from '$lib/server/db';
import { questions } from '$lib/server/schema';

export async function load() {
	const allQuestions = db
		.select()
		.from(questions)
		.all();

	return {
		questions: allQuestions
	};
}
