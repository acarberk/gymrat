#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC = '/tmp/free-exercise-db.json';
const OUT = path.join(ROOT, 'static/data/exercises.json');

const muscleMap = {
	abdominals: 'core',
	hamstrings: 'hamstrings',
	adductors: 'quads',
	abductors: 'glutes',
	quadriceps: 'quads',
	biceps: 'biceps',
	shoulders: 'shoulders',
	chest: 'chest',
	'middle back': 'back',
	calves: 'calves',
	glutes: 'glutes',
	'lower back': 'back',
	lats: 'back',
	triceps: 'triceps',
	traps: 'back',
	forearms: 'forearms',
	neck: 'core'
};

const equipmentMap = {
	'body only': 'bodyweight',
	machine: 'machine',
	other: 'other',
	'foam roll': 'other',
	kettlebells: 'kettlebell',
	dumbbell: 'dumbbell',
	cable: 'cable',
	barbell: 'barbell',
	bands: 'band',
	'medicine ball': 'other',
	'exercise ball': 'other',
	'e-z curl bar': 'barbell'
};

const trNames = {
	'Barbell Squat': 'Barbell Squat',
	'Bench Press': 'Bench Press',
	Deadlift: 'Deadlift',
	'Romanian Deadlift': 'Romen Deadlift',
	'Pull Up': 'Barfiks (Pull-up)',
	'Pull-up': 'Barfiks (Pull-up)',
	'Chin Up': 'Chin-up',
	'Push Up': 'Şınav',
	'Push-Up': 'Şınav',
	'Dumbbell Bench Press': 'Dumbbell Bench Press',
	'Dumbbell Row': 'Dumbbell Row',
	'Bent Over Barbell Row': 'Barbell Row',
	'Barbell Curl': 'Barbell Curl',
	'Dumbbell Curl': 'Dumbbell Curl',
	'Tricep Dips': 'Dips (Triceps)',
	'Overhead Press': 'Overhead Press',
	'Standing Military Press': 'Military Press',
	'Lateral Raise': 'Yan Yükseliş',
	'Front Dumbbell Raise': 'Ön Yükseliş',
	'Barbell Lunge': 'Barbell Lunge',
	'Walking Lunge': 'Yürüyen Lunge',
	'Leg Press': 'Leg Press',
	'Leg Curl': 'Leg Curl',
	'Leg Extension': 'Leg Extension',
	'Standing Calf Raises': 'Calf Raise',
	Plank: 'Plank',
	'Hanging Leg Raise': 'Asılı Bacak Kaldırma',
	'Cable Crossover': 'Cable Crossover',
	'Incline Dumbbell Bench Press': 'Eğimli Dumbbell Bench',
	'Lat Pulldown': 'Lat Pulldown',
	'Seated Cable Row': 'Oturarak Cable Row',
	'Face Pull': 'Face Pull',
	'Hip Thrust': 'Hip Thrust',
	'Bulgarian Split Squat': 'Bulgar Split Squat',
	'Goblet Squat': 'Goblet Squat',
	'Front Squat': 'Front Squat'
};

const slug = (s) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_|_$/g, '');

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const out = raw
	.filter((e) => e.primaryMuscles?.length && e.equipment !== null)
	.map((e) => {
		const primary = muscleMap[e.primaryMuscles[0]] ?? 'full_body';
		const secondary = (e.secondaryMuscles ?? [])
			.map((m) => muscleMap[m])
			.filter((m, i, a) => m && a.indexOf(m) === i && m !== primary);
		return {
			id: e.id ?? slug(e.name),
			name_tr: trNames[e.name] ?? e.name,
			name_en: e.name,
			primary_muscle: primary,
			secondary_muscles: secondary,
			equipment: equipmentMap[e.equipment] ?? 'other',
			is_compound: e.mechanic !== 'isolation',
			images: (e.images ?? []).slice(0, 2),
			instructions_tr: [],
			instructions_en: e.instructions ?? []
		};
	});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote ${out.length} exercises → ${OUT}`);
console.log('Size:', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB');
