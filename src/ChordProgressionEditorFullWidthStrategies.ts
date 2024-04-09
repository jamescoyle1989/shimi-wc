import { ChordProgressionEditorViewModel } from "./ChordProgressionEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export class DefaultChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class WrapChordProgressionEditorFullWidthStrategy
    extends FullWidthStrategy<ChordProgressionEditorViewModel> {

    private _targetBeatWidth: number;

    constructor(targetBeatWidth: number) {
        super();
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