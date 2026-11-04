<script lang="ts">
	import { timeline } from 'chnobli';
	import type { Scroll } from 'chnobli/scroll';
	import { createTransition, scroll } from '../index.js';

	let {
		show,
		onscroll,
	}: { show: boolean; onscroll: (scroll: Scroll) => void } = $props();

	scroll(onscroll);

	const fade = createTransition(el =>
		timeline().add(el, { opacity: 1, duration: 100 }),
	);
</script>

{#if show}
	<div class="box" style="opacity: 0" transition:fade></div>
{/if}
