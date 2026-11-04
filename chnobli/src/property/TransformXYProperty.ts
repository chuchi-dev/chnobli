import Value from '../values/Value.js';
import Property from './Property.js';
import { Target } from '../target/Target.js';

export type XYValue = {
	x: Value;
	y: Value;
};

export default class TransformXYProperty implements Property<XYValue> {
	name: string;

	from!: XYValue;
	to!: XYValue;

	private before: { x: Value | null; y: Value | null } = {
		x: null,
		y: null,
	};

	constructor(name: string) {
		this.name = name;
	}

	allowsValueFn(): boolean {
		return true;
	}

	init(target: Target, from: XYValue | null, to: XYValue | null) {
		if (!from) from = this.getValue(target);

		if (!to) to = this.getValue(target);

		if (!from || !to)
			throw new Error('could not determine from or to value');

		const [fromX, toX] = target.unifyValues('x', from.x, to.x);
		const [fromY, toY] = target.unifyValues('y', from.y, to.y);

		this.from = { x: fromX, y: fromY };
		this.to = { x: toX, y: toY };
	}

	parseValue(val: any) {
		if (Array.isArray(val)) val = { x: val[0], y: val[1] };

		const { x, y } = val;

		return {
			x: Value.parse(x),
			y: Value.parse(y),
		};
	}

	defaultValue() {
		return {
			x: new Value(0, 'px'),
			y: new Value(0, 'px'),
		};
	}

	getValue(target: Target): XYValue {
		const x = target.getTransformValue('x');
		const y = target.getTransformValue('y');

		const def = this.defaultValue();

		return {
			x: x ? x : def.x,
			y: y ? y : def.y,
		};
	}

	interpolate(pos: number): XYValue {
		const difX = this.to.x.num - this.from.x.num;
		const difY = this.to.y.num - this.from.y.num;

		return {
			x: this.from.x.cloneAdd(pos * difX),
			y: this.from.y.cloneAdd(pos * difY),
		};
	}

	setValue(target: Target, val: XYValue) {
		target.setTransformValue('x', val.x.withDefaultUnit('px'));
		target.setTransformValue('y', val.y.withDefaultUnit('px'));
	}

	saveBefore(target: Target) {
		this.before = {
			x: target.getTransformValue('x')?.clone() ?? null,
			y: target.getTransformValue('y')?.clone() ?? null,
		};
	}

	restoreBefore(target: Target) {
		for (const name of ['x', 'y'] as const) {
			const val = this.before[name];
			if (val) target.setTransformValue(name, val.clone());
			else target.removeTransformValue(name);
		}
	}
}
