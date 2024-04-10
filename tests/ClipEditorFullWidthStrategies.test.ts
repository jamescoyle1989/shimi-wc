import { expect, test } from 'vitest';
import {
    StretchClipEditorFullWidthStrategy,
    BoundedStretchClipEditorFullWidthStrategy,
    getFullWidthStrategyByName,
    LinearScaleClipEditorFullWidthStrategy
} from '../src/ClipEditorFullWidthStrategies';

test('Can get stretch strategy', () => {
    const strategy = getFullWidthStrategyByName('stretch');
    expect(strategy).toBeInstanceOf(StretchClipEditorFullWidthStrategy);
});

test('Cant get bounded stretch with default values', () => {
    expect(() => getFullWidthStrategyByName('boundedstretch')).toThrowError();
});

test('Can get bounded strategy with custom values', () => {
    const strategy = getFullWidthStrategyByName('boundedstretch-50-200');
    expect(strategy).toBeInstanceOf(BoundedStretchClipEditorFullWidthStrategy);
    const bounded = strategy as BoundedStretchClipEditorFullWidthStrategy;
    expect(bounded.minBeatWidth).toBe(50);
    expect(bounded.maxBeatWidth).toBe(200);
});

test('Can get linearscale strategy with default values', () => {
    const strategy = getFullWidthStrategyByName('linearscale');
    expect(strategy).toBeInstanceOf(LinearScaleClipEditorFullWidthStrategy);
    const scale = strategy as LinearScaleClipEditorFullWidthStrategy;
    expect(scale.yScaleM).toBe(1);
    expect(scale.yScaleC).toBe(0);
});

test('Can get linearscale strategy with default 2nd parameter', () => {
    const strategy = getFullWidthStrategyByName('linearscale-0.5');
    expect(strategy).toBeInstanceOf(LinearScaleClipEditorFullWidthStrategy);
    const scale = strategy as LinearScaleClipEditorFullWidthStrategy;
    expect(scale.yScaleM).toBe(0.5);
    expect(scale.yScaleC).toBe(0);
});

test('Can get linearscale strategy with default values', () => {
    const strategy = getFullWidthStrategyByName('linearscale-0.7-100');
    expect(strategy).toBeInstanceOf(LinearScaleClipEditorFullWidthStrategy);
    const scale = strategy as LinearScaleClipEditorFullWidthStrategy;
    expect(scale.yScaleM).toBe(0.7);
    expect(scale.yScaleC).toBe(100);
});