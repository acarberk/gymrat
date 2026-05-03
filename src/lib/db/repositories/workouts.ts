import { db } from '$lib/db/schema';
import {
	WorkoutSessionSchema,
	WorkoutSetSchema,
	WorkoutTemplateSchema,
	ProgramSchema,
	type WorkoutSession,
	type WorkoutSet,
	type WorkoutTemplate,
	type Program
} from '$lib/types';

export async function startSession(session: WorkoutSession): Promise<void> {
	const valid = WorkoutSessionSchema.parse(session);
	await db.sessions.add(valid);
}

export async function getSession(id: string): Promise<WorkoutSession | undefined> {
	return db.sessions.get(id);
}

export async function endSession(id: string, ended_at: number = Date.now()): Promise<void> {
	await db.sessions.update(id, { ended_at });
}

export async function deleteSession(id: string): Promise<void> {
	await db.transaction('rw', db.sessions, db.sets, async () => {
		await db.sets.where('session_id').equals(id).delete();
		await db.sessions.delete(id);
	});
}

export async function recentSessions(limit = 20): Promise<WorkoutSession[]> {
	return db.sessions.orderBy('started_at').reverse().limit(limit).toArray();
}

export async function activeSession(): Promise<WorkoutSession | undefined> {
	return db.sessions.filter((s) => s.ended_at === undefined).last();
}

export async function setsForSession(session_id: string): Promise<WorkoutSet[]> {
	const sets = await db.sets.where('session_id').equals(session_id).toArray();
	return sets.sort((a, b) => a.order - b.order);
}

export async function addSet(set: WorkoutSet): Promise<void> {
	const valid = WorkoutSetSchema.parse(set);
	await db.sets.add(valid);
}

export async function updateSet(id: string, patch: Partial<WorkoutSet>): Promise<void> {
	await db.sets.update(id, patch);
}

export async function removeSet(id: string): Promise<void> {
	await db.sets.delete(id);
}

export async function setsForExercise(exercise_id: string, limit = 100): Promise<WorkoutSet[]> {
	return db.sets.where('exercise_id').equals(exercise_id).limit(limit).toArray();
}

export async function bulkUpsertTemplates(templates: WorkoutTemplate[]): Promise<void> {
	const valid = templates.map((t) => WorkoutTemplateSchema.parse(t));
	await db.templates.bulkPut(valid);
}

export async function bulkUpsertPrograms(programs: Program[]): Promise<void> {
	const valid = programs.map((p) => ProgramSchema.parse(p));
	await db.programs.bulkPut(valid);
}

export async function listPrograms(): Promise<Program[]> {
	return db.programs.toArray();
}

export async function getProgram(id: string): Promise<Program | undefined> {
	return db.programs.get(id);
}

export async function getTemplate(id: string): Promise<WorkoutTemplate | undefined> {
	return db.templates.get(id);
}

export async function templatesForProgram(program_id: string): Promise<WorkoutTemplate[]> {
	const all = await db.templates.where('program_id').equals(program_id).toArray();
	return all.sort((a, b) => (a.day_index ?? 0) - (b.day_index ?? 0));
}
