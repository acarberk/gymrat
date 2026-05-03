<script lang="ts">
	type Props = {
		value: number;
		target: number;
		label: string;
		unit?: string;
		color?: string;
		size?: number;
	};

	let { value, target, label, unit = 'g', color = '#22d3ee', size = 88 }: Props = $props();

	const stroke = 8;
	const radius = $derived((size - stroke) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const pct = $derived(target > 0 ? Math.min(value / target, 1.2) : 0);
	const dashoffset = $derived(circumference * (1 - Math.min(pct, 1)));
	const displayValue = $derived(Math.round(value));
	const displayTarget = $derived(Math.round(target));
</script>

<div class="flex flex-col items-center gap-1">
	<div class="relative" style:width="{size}px" style:height="{size}px">
		<svg width={size} height={size} class="-rotate-90">
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke="rgb(51 65 85)"
				stroke-width={stroke}
				fill="none"
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke={pct > 1 ? '#ef4444' : color}
				stroke-width={stroke}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={dashoffset}
				fill="none"
				class="transition-[stroke-dashoffset] duration-500"
			/>
		</svg>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-base font-semibold text-slate-100">{displayValue}</span>
			<span class="text-[10px] text-slate-400">/ {displayTarget}{unit}</span>
		</div>
	</div>
	<span class="text-xs font-medium text-slate-300">{label}</span>
</div>
