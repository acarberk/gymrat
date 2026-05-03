import type { ActivityLevel, Goal, Sex } from '$lib/types';

export type OnboardingDraft = {
	name?: string;
	sex?: Sex;
	birth_year?: number;
	height_cm?: number;
	weight_kg?: number;
	activity_level?: ActivityLevel;
	goal?: Goal;
	weekly_workout_target?: number;
};

class OnboardingStore {
	draft = $state<OnboardingDraft>({});

	patch(p: Partial<OnboardingDraft>): void {
		this.draft = { ...this.draft, ...p };
	}

	reset(): void {
		this.draft = {};
	}

	get isProfileComplete(): boolean {
		return !!(this.draft.sex && this.draft.birth_year);
	}

	get isBodyComplete(): boolean {
		return !!(this.draft.height_cm && this.draft.weight_kg);
	}

	get isReady(): boolean {
		return !!(
			this.draft.sex &&
			this.draft.birth_year &&
			this.draft.height_cm &&
			this.draft.weight_kg &&
			this.draft.activity_level &&
			this.draft.goal
		);
	}
}

export const onboarding = new OnboardingStore();
