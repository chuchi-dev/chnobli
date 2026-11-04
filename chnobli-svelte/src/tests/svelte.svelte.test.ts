import { describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import type { Scroll } from 'chnobli/scroll';
import Test from './Test.svelte';

// jsdom has no web animations, svelte only needs the timing of them
Element.prototype.animate = function (_keyframes, opts) {
	const duration = (opts as KeyframeAnimationOptions).duration as number;
	const start = performance.now();
	const animation = {
		playState: 'running',
		get currentTime() {
			return Math.min(performance.now() - start, duration);
		},
		onfinish: null as (() => void) | null,
		cancel() {
			this.playState = 'idle';
		},
	};
	setTimeout(() => {
		animation.playState = 'finished';
		animation.onfinish?.();
	}, duration);
	return animation as unknown as Animation;
};

describe('svelte', () => {
	it('scroll is created on mount and destroyed on unmount', () => {
		let scroll: Scroll | null = null;
		const onscroll = vi.fn((s: Scroll) => (scroll = s));

		const comp = mount(Test, {
			target: document.body,
			props: { show: false, onscroll },
		});
		flushSync();
		expect(onscroll).toHaveBeenCalledOnce();

		const destroy = vi.spyOn(scroll!, 'destroy');
		unmount(comp);
		expect(destroy).toHaveBeenCalledOnce();
	});

	it('transition seeks the timeline in and out', async () => {
		const props = $state({ show: false, onscroll: () => {} });
		const comp = mount(Test, { target: document.body, props });
		flushSync();
		expect(document.querySelector('.box')).toBeNull();

		props.show = true;
		flushSync();
		const box = document.querySelector<HTMLElement>('.box')!;
		expect(box).not.toBeNull();

		await new Promise(r => setTimeout(r, 300));
		expect(box.style.opacity).toBe('1');

		props.show = false;
		flushSync();
		await new Promise(r => setTimeout(r, 300));
		expect(document.querySelector('.box')).toBeNull();

		unmount(comp);
	});
});
