import { describe, expect, it } from 'vitest';
import ScrollTimeline from '../scroll/Scroll.js';

function scrollWith(offsets: [number, number, number][]) {
	const s = new ScrollTimeline();
	s.offsets = offsets.map(([y, view, position]) => ({ y, view, position }));
	return (y: number) => (s as any).calcPosition({ y, height: 100 });
}

describe('scroll', () => {
	it('position', () => {
		// from 0 to 900, like a page that can't scroll past the end
		const pos = scrollWith([
			[0, 0, 0],
			[900, 0, 1],
		]);

		expect(pos(-1)).toBe(-1);
		expect(pos(0)).toBe(0);
		expect(pos(450)).toBe(0.5);
		expect(pos(900)).toBe(1);
		expect(pos(901)).toBe(2);
	});

	it('position with three offsets', () => {
		const pos = scrollWith([
			[0, 0, 0],
			[200, 1, 0.5],
			[500, 0, 1],
		]);

		expect(pos(100)).toBe(0.5);
		expect(pos(300)).toBe(0.75);
		expect(pos(500)).toBe(1);
	});
});
