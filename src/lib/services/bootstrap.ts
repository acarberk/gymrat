import { browser } from '$app/environment';
import { bulkUpsertFoods, countFoods } from '$lib/db/repositories/foods';
import { bulkUpsertExercises, countExercises } from '$lib/db/repositories/exercises';
import { bulkUpsertPrograms, bulkUpsertTemplates } from '$lib/db/repositories/workouts';
import { ExerciseSchema, type Exercise } from '$lib/types';
import { turkishFoods } from '$lib/data/foods-tr';
import { programs, programTemplates } from '$lib/data/programs';

const SEED_VERSION_KEY = 'gymrat:seed_version';
const CURRENT_SEED_VERSION = '1';

async function loadExercises(): Promise<Exercise[]> {
	const res = await fetch('/data/exercises.json');
	if (!res.ok) throw new Error('Egzersiz veritabanı yüklenemedi');
	const raw: unknown[] = await res.json();
	const out: Exercise[] = [];
	for (const r of raw) {
		const parsed = ExerciseSchema.safeParse(r);
		if (parsed.success) out.push(parsed.data);
	}
	return out;
}

export async function bootstrapSeed(): Promise<void> {
	if (!browser) return;

	const stored = localStorage.getItem(SEED_VERSION_KEY);
	if (stored === CURRENT_SEED_VERSION) return;

	const tasks: Promise<void>[] = [];

	if ((await countFoods()) === 0) {
		tasks.push(bulkUpsertFoods(turkishFoods));
	}

	if ((await countExercises()) === 0) {
		tasks.push(loadExercises().then((ex) => bulkUpsertExercises(ex)));
	}

	tasks.push(bulkUpsertPrograms(programs));
	tasks.push(bulkUpsertTemplates(programTemplates));

	await Promise.all(tasks);
	localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
}
