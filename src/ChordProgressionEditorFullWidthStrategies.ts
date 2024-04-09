import { ChordProgressionEditorViewModel } from "./ChordProgressionEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export function getFullWidthStrategyByName(name: string) {
    switch (name) {
        case 'default':
            return new DefaultChordProgressionEditorFullWidthStrategy();
        case 'wrap':
            return new WrapChordProgressionEditorFullWidthStrategy(100);
        default:
            throw Error(`'${name}' is not a valid full-width strategy.`);
    }
}

export class DefaultChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    constructor() {
        super('default');
    }

    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class WrapChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    private _targetBeatWidth: number;

    constructor(targetBeatWidth: number) {
        super('wrap');
        this._targetBeatWidth = targetBeatWidth;
    }

    resize(entry: ResizeObserverEntry): void {
        const vm = this.viewModel;
        const targetBeatsPerLine = entry.contentRect.width / this._targetBeatWidth;
        const nearestBarBeatsPerLine = Math.max(vm.beatsPerBar, Math.round(targetBeatsPerLine / vm.beatsPerBar) * vm.beatsPerBar);
        vm.maxBeatsPerLine = nearestBarBeatsPerLine;
        vm.beatWidth = entry.contentRect.width / nearestBarBeatsPerLine;
    }
}