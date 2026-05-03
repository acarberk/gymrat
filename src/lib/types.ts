import { z } from 'zod';

export const SexSchema = z.enum(['male', 'female']);
export type Sex = z.infer<typeof SexSchema>;

export const ActivityLevelSchema = z.enum([
	'sedentary',
	'light',
	'moderate',
	'active',
	'very_active'
]);
export type ActivityLevel = z.infer<typeof ActivityLevelSchema>;

export const GoalSchema = z.enum(['cut', 'maintain', 'lean_bulk', 'bulk']);
export type Goal = z.infer<typeof GoalSchema>;

export const UnitSystemSchema = z.enum(['metric', 'imperial']);
export type UnitSystem = z.infer<typeof UnitSystemSchema>;

export const LocaleSchema = z.enum(['tr', 'en']);
export type Locale = z.infer<typeof LocaleSchema>;

export const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);
export type MealType = z.infer<typeof MealTypeSchema>;

export const MacroTargetsSchema = z.object({
	calories: z.number().positive(),
	protein_g: z.number().positive(),
	carbs_g: z.number().nonnegative(),
	fat_g: z.number().positive()
});
export type MacroTargets = z.infer<typeof MacroTargetsSchema>;

export const UserProfileSchema = z.object({
	id: z.literal('me'),
	created_at: z.number().int(),
	updated_at: z.number().int(),
	locale: LocaleSchema.default('tr'),
	unit_system: UnitSystemSchema.default('metric'),
	name: z.string().optional(),
	sex: SexSchema,
	birth_year: z.number().int().min(1900).max(new Date().getFullYear()),
	height_cm: z.number().positive(),
	weight_kg: z.number().positive(),
	body_fat_pct: z.number().min(2).max(60).optional(),
	activity_level: ActivityLevelSchema,
	goal: GoalSchema,
	target_weight_kg: z.number().positive().optional(),
	macro_targets: MacroTargetsSchema,
	weekly_workout_target: z.number().int().min(0).max(14).default(4)
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const NutritionPer100gSchema = z.object({
	calories: z.number().nonnegative(),
	protein_g: z.number().nonnegative(),
	carbs_g: z.number().nonnegative(),
	fat_g: z.number().nonnegative(),
	fiber_g: z.number().nonnegative().optional(),
	sugar_g: z.number().nonnegative().optional(),
	sodium_mg: z.number().nonnegative().optional()
});
export type NutritionPer100g = z.infer<typeof NutritionPer100gSchema>;

export const FoodSourceSchema = z.enum(['curated_tr', 'open_food_facts', 'usda', 'user']);
export type FoodSource = z.infer<typeof FoodSourceSchema>;

export const ServingSchema = z.object({
	label: z.string(),
	grams: z.number().positive()
});
export type Serving = z.infer<typeof ServingSchema>;

export const FoodSchema = z.object({
	id: z.string(),
	name_tr: z.string(),
	name_en: z.string().optional(),
	brand: z.string().optional(),
	barcode: z.string().optional(),
	source: FoodSourceSchema,
	per_100g: NutritionPer100gSchema,
	default_serving: ServingSchema,
	servings: z.array(ServingSchema).default([]),
	tags: z.array(z.string()).default([]),
	created_at: z.number().int(),
	is_favorite: z.boolean().default(false)
});
export type Food = z.infer<typeof FoodSchema>;

export const FoodLogEntrySchema = z.object({
	id: z.string(),
	date: z.string(),
	meal: MealTypeSchema,
	food_id: z.string(),
	grams: z.number().positive(),
	created_at: z.number().int()
});
export type FoodLogEntry = z.infer<typeof FoodLogEntrySchema>;

export const MuscleGroupSchema = z.enum([
	'chest',
	'back',
	'shoulders',
	'biceps',
	'triceps',
	'forearms',
	'quads',
	'hamstrings',
	'glutes',
	'calves',
	'core',
	'cardio',
	'full_body'
]);
export type MuscleGroup = z.infer<typeof MuscleGroupSchema>;

export const EquipmentSchema = z.enum([
	'barbell',
	'dumbbell',
	'machine',
	'cable',
	'bodyweight',
	'kettlebell',
	'band',
	'other'
]);
export type Equipment = z.infer<typeof EquipmentSchema>;

export const ExerciseSchema = z.object({
	id: z.string(),
	name_tr: z.string(),
	name_en: z.string(),
	primary_muscle: MuscleGroupSchema,
	secondary_muscles: z.array(MuscleGroupSchema).default([]),
	equipment: EquipmentSchema,
	is_compound: z.boolean(),
	images: z.array(z.string()).default([]),
	instructions_tr: z.array(z.string()).default([]),
	instructions_en: z.array(z.string()).default([])
});
export type Exercise = z.infer<typeof ExerciseSchema>;

export const SetTypeSchema = z.enum(['warmup', 'working', 'drop', 'failure']);
export type SetType = z.infer<typeof SetTypeSchema>;

export const WorkoutSetSchema = z.object({
	id: z.string(),
	session_id: z.string(),
	exercise_id: z.string(),
	set_type: SetTypeSchema.default('working'),
	order: z.number().int().nonnegative(),
	reps: z.number().int().nonnegative(),
	weight_kg: z.number().nonnegative(),
	rpe: z.number().min(1).max(10).optional(),
	completed: z.boolean().default(false),
	notes: z.string().optional()
});
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;

export const WorkoutSessionSchema = z.object({
	id: z.string(),
	template_id: z.string().optional(),
	name: z.string(),
	started_at: z.number().int(),
	ended_at: z.number().int().optional(),
	notes: z.string().optional(),
	body_weight_kg: z.number().positive().optional()
});
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

export const TemplateExerciseSchema = z.object({
	exercise_id: z.string(),
	target_sets: z.number().int().positive(),
	target_reps_min: z.number().int().positive(),
	target_reps_max: z.number().int().positive(),
	rest_seconds: z.number().int().nonnegative().default(120),
	notes: z.string().optional()
});
export type TemplateExercise = z.infer<typeof TemplateExerciseSchema>;

export const WorkoutTemplateSchema = z.object({
	id: z.string(),
	name_tr: z.string(),
	name_en: z.string(),
	program_id: z.string().optional(),
	day_index: z.number().int().nonnegative().optional(),
	exercises: z.array(TemplateExerciseSchema),
	is_user_created: z.boolean().default(false),
	created_at: z.number().int()
});
export type WorkoutTemplate = z.infer<typeof WorkoutTemplateSchema>;

export const ProgramSchema = z.object({
	id: z.string(),
	name_tr: z.string(),
	name_en: z.string(),
	description_tr: z.string(),
	description_en: z.string(),
	frequency_per_week: z.number().int().positive(),
	level: z.enum(['beginner', 'intermediate', 'advanced']),
	template_ids: z.array(z.string())
});
export type Program = z.infer<typeof ProgramSchema>;

export const BodyMetricEntrySchema = z.object({
	id: z.string(),
	date: z.string(),
	weight_kg: z.number().positive().optional(),
	body_fat_pct: z.number().min(2).max(60).optional(),
	waist_cm: z.number().positive().optional(),
	notes: z.string().optional(),
	created_at: z.number().int()
});
export type BodyMetricEntry = z.infer<typeof BodyMetricEntrySchema>;
