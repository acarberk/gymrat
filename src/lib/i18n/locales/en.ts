import type { TranslationDict } from './tr';

export const en: TranslationDict = {
	common: {
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		search: 'Search',
		loading: 'Loading…',
		next: 'Continue',
		back: 'Back',
		done: 'Done',
		yes: 'Yes',
		no: 'No',
		grams: 'grams',
		kg: 'kg',
		cm: 'cm',
		reps: 'reps',
		sets: 'sets',
		minutes: 'minutes'
	},
	tabs: {
		home: 'Today',
		nutrition: 'Nutrition',
		workout: 'Workout',
		progress: 'Progress',
		settings: 'Settings'
	},
	onboarding: {
		welcome: {
			title: 'Welcome to Gymrat',
			subtitle:
				'Track nutrition and workouts in one place. No ads, no subscriptions, your data stays yours.',
			cta: 'Get started'
		},
		steps: {
			profile: 'Profile',
			body: 'Body',
			activity: 'Activity',
			goal: 'Goal',
			summary: 'Summary'
		},
		profile: {
			title: 'How should I call you?',
			name_label: 'Name (optional)',
			name_placeholder: 'Alex',
			sex_label: 'Sex',
			sex_male: 'Male',
			sex_female: 'Female',
			birth_year_label: 'Birth year'
		},
		body: {
			title: 'Body measurements',
			height_label: 'Height',
			weight_label: 'Weight'
		},
		activity: {
			title: 'Your daily activity level',
			sedentary: 'Sedentary',
			sedentary_desc: 'Desk job, little walking',
			light: 'Light',
			light_desc: '1-3 workouts per week',
			moderate: 'Moderate',
			moderate_desc: '3-5 workouts per week',
			active: 'Active',
			active_desc: '6-7 workouts per week',
			very_active: 'Very active',
			very_active_desc: 'Intense training + physical job'
		},
		goal: {
			title: 'What\'s your goal?',
			cut: 'Cut fat',
			cut_desc: 'Lose ~0.5 kg per week',
			maintain: 'Maintain',
			maintain_desc: 'Hold current shape',
			lean_bulk: 'Lean bulk',
			lean_bulk_desc: 'Slow muscle gain',
			bulk: 'Bulk',
			bulk_desc: 'Gain ~0.25 kg per week',
			weekly_workout: 'Weekly workout target'
		},
		summary: {
			title: 'Your macro targets',
			calories: 'Calories',
			protein: 'Protein',
			carbs: 'Carbs',
			fat: 'Fat',
			explanation:
				'Mifflin-St Jeor BMR + activity multiplier + goal calorie delta. Adjustable in settings.',
			finish: 'Finish'
		}
	},
	home: {
		greeting_morning: 'Good morning',
		greeting_day: 'Hey',
		greeting_evening: 'Good evening',
		today_summary: 'Today',
		calories_remaining: 'Calories remaining',
		quick_add_food: 'Quick add food',
		start_workout: 'Start workout',
		log_weight: 'Log weight'
	},
	nutrition: {
		title: 'Nutrition',
		breakfast: 'Breakfast',
		lunch: 'Lunch',
		dinner: 'Dinner',
		snack: 'Snack',
		add_food: 'Add food',
		scan_barcode: 'Scan barcode',
		search_food: 'Search food',
		gram_label: 'Amount (g)',
		serving_label: 'Serving',
		empty_meal: 'Nothing logged yet',
		not_found: 'Food not found',
		create_food: 'Create new food',
		macros: 'Macros'
	},
	workout: {
		title: 'Workout',
		programs: 'Programs',
		templates: 'Templates',
		history: 'History',
		start_empty: 'Start empty workout',
		exercises: 'Exercises',
		add_exercise: 'Add exercise',
		set: 'Set',
		weight: 'Weight',
		reps: 'Reps',
		rpe: 'RPE',
		rest: 'Rest',
		finish_workout: 'Finish workout',
		previous: 'Previous',
		empty_session: 'No exercises yet'
	},
	settings: {
		title: 'Settings',
		profile: 'Profile',
		macros: 'Macro targets',
		language: 'Language',
		units: 'Unit system',
		export: 'Export data',
		import: 'Import data',
		about: 'About',
		data_sources: 'Data sources',
		reset: 'Erase all data',
		reset_confirm: 'All data will be erased. Are you sure?'
	}
};
