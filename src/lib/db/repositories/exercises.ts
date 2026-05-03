import { db } from '$lib/db/schema';
import { ExerciseSchema, type Exercise, type MuscleGroup } from '$lib/types';

export async function getExercise(id: string): Promise<Exercise | undefined> {
	return db.exercises.get(id);
}

export async function searchExercises(query: string, limit = 50): Promise<Exercise[]> {
	const q = query.trim().toLowerCase();
	if (!q) {
		return db.exercises.orderBy('name_tr').limit(limit).toArray();
	}
	const all = await db.exercises.toArray();
	return all
		.filter(
			(e) =>
				e.name_tr.toLowerCase().includes(q) ||
				e.name_en.toLowerCase().includes(q)
		)
		.slice(0, limit);
}

export async function exercisesByMuscle(muscle: MuscleGroup): Promise<Exercise[]> {
	return db.exercises.where('primary_muscle').equals(muscle).toArray();
}

export async function bulkUpsertExercises(exercises: Exercise[]): Promise<void> {
	const valid = exercises.map((e) => ExerciseSchema.parse(e));
	await db.exercises.bulkPut(valid);
}

export async function countExercises(): Promise<number> {
	return db.exercises.count();
}
