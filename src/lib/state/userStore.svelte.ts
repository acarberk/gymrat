import { getUser, saveUser } from '$lib/db/repositories/user';
import type { UserProfile } from '$lib/types';

class UserStore {
	profile = $state<UserProfile | null>(null);
	loaded = $state(false);

	async load(): Promise<void> {
		const u = await getUser();
		this.profile = u ?? null;
		this.loaded = true;
	}

	async save(profile: UserProfile): Promise<void> {
		await saveUser(profile);
		this.profile = profile;
	}

	clear(): void {
		this.profile = null;
		this.loaded = true;
	}
}

export const userStore = new UserStore();
