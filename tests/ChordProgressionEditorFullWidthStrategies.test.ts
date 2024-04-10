import { expect, test } from 'vitest';
import {
    StretchChordProgressionEditorFullWidthStrategy,
    WrapChordProgressionEditorFullWidthStrategy,
    getFullWidthStrategyByName
} from '../src/ChordProgressionEditorFullWidthStrategies';

test('Can get stretch strategy', () => {
    const strategy = getFullWidthStrategyByName('stretch');
    expect(strategy).toBeInstanceOf(StretchChordProgressionEditorFullWidthStrategy);
});

test('Can get wrap strategy with default value', () => {
    const strategy = getFullWidthStrategyByName('wrap');
    expect(strategy).toBeInstanceOf(WrapChordProgressionEditorFullWidthStrategy);
    const wrapped = strategy as WrapChordProgressionEditorFullWidthStrategy;
    expect(wrapped.targetBeatWidth).toBe(100);
});

test('Can get wrap strategy with custom values', () => {
    const strategy = getFullWidthStrategyByName('wrap-57');
    expect(strategy).toBeInstanceOf(WrapChordProgressionEditorFullWidthStrategy);
    const wrapped = strategy as WrapChordProgressionEditorFullWidthStrategy;
    expect(wrapped.targetBeatWidth).toBe(57);
});