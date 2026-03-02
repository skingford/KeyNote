import { fail } from '@sveltejs/kit';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, questions } from '$lib/server/db/schema';
import { syncCategoriesFromQuestions } from '$lib/server/categories';

const PAGE_SIZE = 10;

export async function load({ url }: { url: URL }) {
	await syncCategoriesFromQuestions();
	const pageParam = Number(url.searchParams.get('page') || '1');
	let page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

	const [{ total }] = await db
		.select({ total: sql<number>`count(${categories.id})`.mapWith(Number).as('total') })
		.from(categories);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	if (page > totalPages) page = totalPages;
	const offset = (page - 1) * PAGE_SIZE;

	const rows = await db
		.select({
			id: categories.id,
			name: categories.name,
			count: sql<number>`count(${questions.id})`.mapWith(Number).as('count')
		})
		.from(categories)
		.leftJoin(questions, eq(questions.category, categories.name))
		.groupBy(categories.id, categories.name)
		.orderBy(asc(categories.name))
		.limit(PAGE_SIZE)
		.offset(offset);

	return {
		categories: rows,
		pagination: {
			page,
			pageSize: PAGE_SIZE,
			total,
			totalPages
		}
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') || '').trim();

		if (!name) return fail(400, { error: '分类名称不能为空' });

		try {
			await db.insert(categories).values({ name }).onConflictDoNothing();
			return { success: true };
		} catch (err: any) {
			return fail(400, { error: err.message || '创建分类失败' });
		}
	},
	rename: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const name = String(data.get('name') || '').trim();

		if (!id || Number.isNaN(id)) return fail(400, { error: '分类 ID 无效' });
		if (!name) return fail(400, { error: '新分类名称不能为空' });

		const [existing] = await db.select().from(categories).where(eq(categories.id, id));
		if (!existing) return fail(404, { error: '分类不存在' });

		const [duplicate] = await db
			.select()
			.from(categories)
			.where(and(eq(categories.name, name), ne(categories.id, id)));
		if (duplicate) return fail(400, { error: '分类名称已存在' });

		try {
			await db.update(categories).set({ name }).where(eq(categories.id, id));
			await db.update(questions).set({ category: name }).where(eq(questions.category, existing.name));
			return { success: true };
		} catch (err: any) {
			return fail(400, { error: err.message || '重命名分类失败' });
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id || Number.isNaN(id)) return fail(400, { error: '分类 ID 无效' });

		const [existing] = await db.select().from(categories).where(eq(categories.id, id));
		if (!existing) return fail(404, { error: '分类不存在' });

		const [{ count }] = await db
			.select({ count: sql<number>`count(${questions.id})`.mapWith(Number).as('count') })
			.from(questions)
			.where(eq(questions.category, existing.name));

		if (count > 0) {
			return fail(400, { error: `该分类下还有 ${count} 道题，请先迁移或重命名题目分类` });
		}

		try {
			await db.delete(categories).where(eq(categories.id, id));
			return { success: true };
		} catch (err: any) {
			return fail(400, { error: err.message || '删除分类失败' });
		}
	}
};
