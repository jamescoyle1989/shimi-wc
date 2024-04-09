import { ClipEditorViewModel } from "./ClipEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export class DefaultClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class BoundedClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    private _minBeatWidth: number;
    private _maxBeatWidth: number;
    
    constructor(minBeatWidth: number, maxBeatWidth: number) {
        super();
        this._minBeatWidth = minBeatWidth;
        this._maxBeatWidth = maxBeatWidth;
    }
    
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
        this.viewModel.beatWidth = Math.min(Math.max(this._minBeatWidth, this.viewModel.beatWidth), this._maxBeatWidth);
    }
}