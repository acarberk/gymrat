import Dexie, { type EntityTable } from 'dexie';
import type {
	UserProfile,
	Food,
	FoodLogEntry,
	Exercise,
	WorkoutSession,
	WorkoutSet,
	WorkoutTemplate,
	Program,
	BodyMetricEntry
} from '$lib/types';

export class GymratDB extends Dexie {
	users!: EntityTable<UserProfile, 'id'>;
	foods!: EntityTable<Food, 'id'>;
	food_log!: EntityTable<FoodLogEntry, 'id'>;
	exercises!: EntityTable<Exercise, 'id'>;
	sessions!: EntityTable<WorkoutSession, 'id'>;
	sets!: EntityTable<WorkoutSet, 'id'>;
	templates!: EntityTable<WorkoutTemplate, 'id'>;
	programs!: EntityTable<Program, 'id'>;
	body_metrics!: EntityTable<BodyMetricEntry, 'id'>;

	constructor() {
		super('gymrat');

		this.version(1).stores({
			users: 'id, updated_at',
			foods: 'id, name_tr, barcode, source, *tags',
			food_log: 'id, date, meal, food_id, [date+meal]',
			exercises: 'id, name_tr, name_en, primary_muscle, equipment, is_compound',
			sessions: 'id, started_at, ended_at, template_id',
			sets: 'id, session_id, exercise_id, [session_id+order]',
			templates: 'id, program_id, day_index, is_user_created',
			programs: 'id, level, frequency_per_week',
			body_metrics: 'id, date'
		});
	}
}

export const db = new GymratDB();
