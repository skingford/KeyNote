import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const raw = data.get('data') as string;
		const format = data.get('format') as 'json' | 'markdown';

		try {
			if (format === 'json') {
				const parsed = JSON.parse(raw);
				// Expecting array of { title, content, answer, category }
				if (Array.isArray(parsed)) {
					const values = parsed.map(p => ({
						title: p.title,
						content: p.content,
						answer: p.answer,
						category: p.category || '未分类'
					}));
					await db.insert(questions).values(values);
				} else {
					return fail(400, { error: 'JSON must be an array' });
				}
			} else {
				// Simple Markdown Template parsing
				// Assume format:
				// ---
				// category: Go基础
				// title: Channel 原理
				// ---
				// Content text
				// ===
				// Answer text
				// ***
				
				const blocks = raw.split('***').map(s => s.trim()).filter(Boolean);
				const values = [];
				for (const block of blocks) {
					const parts = block.split('====');
					// If the block doesn't have an answer separator, it might be an intro or malformed block.
					// We just skip it instead of failing the whole import unless NO blocks succeed.
					if (parts.length < 2) continue;
					
					const metadataAndContent = parts[0].trim();
					const answer = parts[1].trim();

					const metadataEnd = metadataAndContent.indexOf('---', 3);
					let category = '未分类';
					let title = '无标题';
					let content = metadataAndContent;

					if (metadataAndContent.startsWith('---') && metadataEnd > 0) {
						const metaRaw = metadataAndContent.substring(3, metadataEnd);
						content = metadataAndContent.substring(metadataEnd + 3).trim();
						
						metaRaw.split('\n').forEach(line => {
							const l = line.trim();
							if (l.startsWith('category:')) category = l.substring(9).trim();
							if (l.startsWith('title:')) title = l.substring(6).trim();
						});
					}

					values.push({
						title,
						category,
						content,
						answer
					});
				}

				if (values.length > 0) {
					await db.insert(questions).values(values);
				} else {
					return fail(400, { error: 'No valid markdown blocks found' });
				}
			}
			return { success: true };
		} catch (err: any) {
			return fail(400, { error: err.message || 'Failed to parse or save data' });
		}
	}
};
