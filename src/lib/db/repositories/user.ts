import { db } from '$lib/db/schema';
import { UserProfileSchema, type UserProfile } from '$lib/types';

export async function getUser(): Promise<UserProfile | undefined> {
	const row = await db.users.get('me');
	if (!row) return undefined;
	const parsed = UserProfileSchema.safeParse(row);
	if (!parsed.success) {
		console.warn('UserProfile schema mismatch', parsed.error.issues);
		return undefined;
	}
	return parsed.data;
}

export async function saveUser(profile: UserProfile): Promise<void> {
	const valid = UserProfileSchema.parse({
		...profile,
		id: 'me',
		updated_at: Date.now()
	});
	await db.users.put(valid);
}

export async function clearUser(): Promise<void> {
	await db.users.clear();
}
