import { ChordProgressionEditorViewModel } from "./ChordProgressionEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export function getFullWidthStrategyByName(name: string) {
    if (name == 'stretch')
        return new StretchChordProgressionEditorFullWidthStrategy();

    if (name == 'wrap')
        return new WrapChordProgressionEditorFullWidthStrategy(100);
    if (name.startsWith('wrap-')) {
        const split = name.split('-');
        if (split.length == 2)
            return new WrapChordProgressionEditorFullWidthStrategy(Number(split[1]));
    }

    throw Error(`'${name}' is not a valid full-width strategy.`);
}

export class StretchChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    constructor() {
        super('stretch');
    }

    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class WrapChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    targetBeatWidth: number;

    constructor(targetBeatWidth: number) {
        super('wrap');
        this.targetBeatWidth = targetBeatWidth;
    }

    resize(entry: ResizeObserverEntry): void {
        const vm = this.viewModel;
        const targetBeatsPerLine = entry.contentRect.width / this.targetBeatWidth;
        const nearestBarBeatsPerLine = Math.max(vm.beatsPerBar, Math.round(targetBeatsPerLine / vm.beatsPerBar) * vm.beatsPerBar);
        vm.maxBeatsPerLine = nearestBarBeatsPerLine;
        vm.beatWidth = entry.contentRect.width / nearestBarBeatsPerLine;
    }
}