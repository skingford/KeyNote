import { db } from './src/lib/server/db/index.js';
import { questions } from './src/lib/server/db/schema.js';
import { eq, or, isNull, lte, and } from 'drizzle-orm';

const query = db.select().from(questions).where(
    and(
        eq(questions.category, 'test'),
        or(lte(questions.due, new Date()), isNull(questions.due))
    )
).limit(20);

console.log(query.toSQL());
