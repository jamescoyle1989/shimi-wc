import { ClipEditorViewModel } from "./ClipEditorViewModel";
import { FullWidthStrategy } from "./FullWidthStrategy";

export function getFullWidthStrategyByName(name: string) {
    if (name == 'stretch')
        return new StretchClipEditorFullWidthStrategy();

    if (name.startsWith('boundedstretch-')) {
        const split = name.split('-');
        if (split.length == 3)
            return new BoundedStretchClipEditorFullWidthStrategy(Number(split[1]), Number(split[2]));
    }

    if (name == 'linearscale')
        return new LinearScaleClipEditorFullWidthStrategy(1, 0);
    if (name.startsWith('linearscale-')) {
        const split = name.split('-');
        if (split.length == 2)
            return new LinearScaleClipEditorFullWidthStrategy(Number(split[1]), 0);
        if (split.length == 3)
            return new LinearScaleClipEditorFullWidthStrategy(Number(split[1]), Number(split[2]));
    }

    throw Error(`'${name}' is not a valid full-width strategy.`);
}



export class StretchClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    constructor() {
        super('stretch');
    }
    
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
    }
}

export class BoundedStretchClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    minBeatWidth: number;
    maxBeatWidth: number;
    
    constructor(minBeatWidth: number, maxBeatWidth: number) {
        super('boundedstretch');
        this.minBeatWidth = minBeatWidth;
        this.maxBeatWidth = maxBeatWidth;
    }
    
    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
        this.viewModel.beatWidth = Math.min(Math.max(this.minBeatWidth, this.viewModel.beatWidth), this.maxBeatWidth);
    }
}

export class LinearScaleClipEditorFullWidthStrategy extends FullWidthStrategy<ClipEditorViewModel> {
    yScaleM: number;
    yScaleC: number;

    constructor(yScaleM: number, yScaleC: number) {
        super('linearscale');
        this.yScaleM = yScaleM;
        this.yScaleC = yScaleC;
    }

    resize(entry: ResizeObserverEntry): void {
        this.viewModel.totalWidth = entry.contentRect.width;
        this.viewModel.yZoom = (this.viewModel.xZoom * this.yScaleM) + this.yScaleC;
    }
}