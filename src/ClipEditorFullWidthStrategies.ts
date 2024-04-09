import { ClipEditorViewModel } from "./ClipEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export function getFullWidthStrategyByName(name: string) {
    switch (name) {
        case 'default':
            return new DefaultClipEditorFullWidthStrategy();
        case 'bounded':
            return new BoundedClipEditorFullWidthStrategy(20, 150);
        default:
            throw Error(`'${name}' is not a valid full-width strategy.`);
    }
}

export class DefaultClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    constructor() {
        super('default');
    }
    
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class BoundedClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    private _minBeatWidth: number;
    private _maxBeatWidth: number;
    
    constructor(minBeatWidth: number, maxBeatWidth: number) {
        super('bounded');
        this._minBeatWidth = minBeatWidth;
        this._maxBeatWidth = maxBeatWidth;
    }
    
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
        this.viewModel.beatWidth = Math.min(Math.max(this._minBeatWidth, this.viewModel.beatWidth), this._maxBeatWidth);
    }
}