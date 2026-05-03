import type { Program, WorkoutTemplate } from '$lib/types';

const now = Date.now();

export const programs: Program[] = [
	{
		id: 'ppl_6day',
		name_tr: 'Push / Pull / Legs (6 gün)',
		name_en: 'Push / Pull / Legs (6 day)',
		description_tr:
			'Haftada 6 gün, her kas grubu 2x. Orta-ileri seviye, hacim odaklı klasik split.',
		description_en:
			'6 days per week, each muscle group 2x. Intermediate-advanced, volume-focused classic split.',
		frequency_per_week: 6,
		level: 'intermediate',
		template_ids: ['ppl_push_a', 'ppl_pull_a', 'ppl_legs_a', 'ppl_push_b', 'ppl_pull_b', 'ppl_legs_b']
	},
	{
		id: 'full_body_3day',
		name_tr: 'Full Body (3 gün)',
		name_en: 'Full Body (3 day)',
		description_tr:
			'Haftada 3 tam vücut antrenmanı. Yeni başlayanlar için ideal, sıklığı yüksek.',
		description_en: 'Three full-body workouts per week. Ideal for beginners, high frequency.',
		frequency_per_week: 3,
		level: 'beginner',
		template_ids: ['fb_a', 'fb_b', 'fb_c']
	}
];

export const programTemplates: WorkoutTemplate[] = [
	{
		id: 'ppl_push_a',
		name_tr: 'PPL — Push A',
		name_en: 'PPL — Push A',
		program_id: 'ppl_6day',
		day_index: 0,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Bench_Press', target_sets: 4, target_reps_min: 6, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Standing_Military_Press', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'Incline_Dumbbell_Press', target_sets: 3, target_reps_min: 8, target_reps_max: 12, rest_seconds: 120 },
			{ exercise_id: 'Side_Lateral_Raise', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Tricep_Dips', target_sets: 3, target_reps_min: 8, target_reps_max: 12, rest_seconds: 90 },
			{ exercise_id: 'Triceps_Pushdown', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 60 }
		]
	},
	{
		id: 'ppl_pull_a',
		name_tr: 'PPL — Pull A',
		name_en: 'PPL — Pull A',
		program_id: 'ppl_6day',
		day_index: 1,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Deadlift', target_sets: 3, target_reps_min: 5, target_reps_max: 6, rest_seconds: 240 },
			{ exercise_id: 'Pull-up', target_sets: 4, target_reps_min: 6, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'Bent_Over_Barbell_Row', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'Seated_Cable_Rows', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 90 },
			{ exercise_id: 'Face_Pull', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Barbell_Curl', target_sets: 3, target_reps_min: 8, target_reps_max: 12, rest_seconds: 60 }
		]
	},
	{
		id: 'ppl_legs_a',
		name_tr: 'PPL — Legs A',
		name_en: 'PPL — Legs A',
		program_id: 'ppl_6day',
		day_index: 2,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Barbell_Squat', target_sets: 4, target_reps_min: 6, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Romanian_Deadlift', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 150 },
			{ exercise_id: 'Leg_Press', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 120 },
			{ exercise_id: 'Lying_Leg_Curls', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 90 },
			{ exercise_id: 'Standing_Calf_Raises', target_sets: 4, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Plank', target_sets: 3, target_reps_min: 30, target_reps_max: 60, rest_seconds: 60 }
		]
	},
	{
		id: 'ppl_push_b',
		name_tr: 'PPL — Push B',
		name_en: 'PPL — Push B',
		program_id: 'ppl_6day',
		day_index: 3,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Standing_Military_Press', target_sets: 4, target_reps_min: 5, target_reps_max: 6, rest_seconds: 180 },
			{ exercise_id: 'Bench_Press', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 150 },
			{ exercise_id: 'Decline_Dumbbell_Bench_Press', target_sets: 3, target_reps_min: 8, target_reps_max: 12, rest_seconds: 120 },
			{ exercise_id: 'Cable_Crossover', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Side_Lateral_Raise', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Skull_Crushers', target_sets: 3, target_reps_min: 8, target_reps_max: 12, rest_seconds: 90 }
		]
	},
	{
		id: 'ppl_pull_b',
		name_tr: 'PPL — Pull B',
		name_en: 'PPL — Pull B',
		program_id: 'ppl_6day',
		day_index: 4,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Bent_Over_Barbell_Row', target_sets: 4, target_reps_min: 6, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Wide-Grip_Lat_Pulldown', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'One-Arm_Dumbbell_Row', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 90 },
			{ exercise_id: 'Face_Pull', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Hammer_Curls', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 60 },
			{ exercise_id: 'Cable_Hammer_Curls_-_Rope_Attachment', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 60 }
		]
	},
	{
		id: 'ppl_legs_b',
		name_tr: 'PPL — Legs B',
		name_en: 'PPL — Legs B',
		program_id: 'ppl_6day',
		day_index: 5,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Front_Barbell_Squat', target_sets: 4, target_reps_min: 8, target_reps_max: 10, rest_seconds: 150 },
			{ exercise_id: 'Romanian_Deadlift', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 150 },
			{ exercise_id: 'Bulgarian_Split_Squat', target_sets: 3, target_reps_min: 10, target_reps_max: 12, rest_seconds: 90 },
			{ exercise_id: 'Leg_Extensions', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Seated_Calf_Raise', target_sets: 4, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Hanging_Leg_Raise', target_sets: 3, target_reps_min: 10, target_reps_max: 15, rest_seconds: 60 }
		]
	},
	{
		id: 'fb_a',
		name_tr: 'Full Body A',
		name_en: 'Full Body A',
		program_id: 'full_body_3day',
		day_index: 0,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Barbell_Squat', target_sets: 3, target_reps_min: 5, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Bench_Press', target_sets: 3, target_reps_min: 5, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Bent_Over_Barbell_Row', target_sets: 3, target_reps_min: 6, target_reps_max: 8, rest_seconds: 150 },
			{ exercise_id: 'Standing_Calf_Raises', target_sets: 3, target_reps_min: 12, target_reps_max: 15, rest_seconds: 60 },
			{ exercise_id: 'Plank', target_sets: 3, target_reps_min: 30, target_reps_max: 60, rest_seconds: 60 }
		]
	},
	{
		id: 'fb_b',
		name_tr: 'Full Body B',
		name_en: 'Full Body B',
		program_id: 'full_body_3day',
		day_index: 1,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Deadlift', target_sets: 1, target_reps_min: 5, target_reps_max: 5, rest_seconds: 300 },
			{ exercise_id: 'Standing_Military_Press', target_sets: 3, target_reps_min: 5, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Pull-up', target_sets: 3, target_reps_min: 5, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'Barbell_Lunge', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 90 },
			{ exercise_id: 'Hanging_Leg_Raise', target_sets: 3, target_reps_min: 10, target_reps_max: 15, rest_seconds: 60 }
		]
	},
	{
		id: 'fb_c',
		name_tr: 'Full Body C',
		name_en: 'Full Body C',
		program_id: 'full_body_3day',
		day_index: 2,
		is_user_created: false,
		created_at: now,
		exercises: [
			{ exercise_id: 'Front_Barbell_Squat', target_sets: 3, target_reps_min: 6, target_reps_max: 8, rest_seconds: 180 },
			{ exercise_id: 'Incline_Dumbbell_Press', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'One-Arm_Dumbbell_Row', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 120 },
			{ exercise_id: 'Romanian_Deadlift', target_sets: 3, target_reps_min: 8, target_reps_max: 10, rest_seconds: 150 },
			{ exercise_id: 'Plank', target_sets: 3, target_reps_min: 30, target_reps_max: 60, rest_seconds: 60 }
		]
	}
];
