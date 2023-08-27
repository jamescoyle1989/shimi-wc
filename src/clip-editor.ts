import { LitElement, TemplateResult, css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { Clip } from 'shimi';
import { ClipEditorViewModel } from './ClipEditorViewModel';
import { ClipEditorBehavior } from './ClipEditorBehavior';

/** Contains attributes and rendering logic */
@customElement('clip-editor')
export class ClipEditor extends LitElement {

    private _viewModel: ClipEditorViewModel = new ClipEditorViewModel();

    private _behavior: ClipEditorBehavior;

    constructor() {
        super();
        this._behavior = new ClipEditorBehavior(this, this._viewModel);
    }
    
    @property({attribute: false})
    get clip(): Clip | null { return this._viewModel.clip; }
    set clip(value: Clip | null) {
        const oldValue = this._viewModel.clip;
        this._viewModel.clip = value;
        this.requestUpdate('clip', oldValue);
    }

    @property({attribute: 'x-zoom', type: Number})
    get xZoom(): number { return this._viewModel.xZoom; }
    set xZoom(value: number) {
        const oldValue = this._viewModel.xZoom;
        this._viewModel.xZoom = value;
        this.requestUpdate('xZoom', oldValue);
    }

    @property({attribute: 'y-zoom', type: Number})
    get yZoom(): number { return this._viewModel.yZoom; }
    set yZoom(value: number) {
        const oldValue = this._viewModel.yZoom;
        this._viewModel.yZoom = value;
        this.requestUpdate('yZoom', oldValue);
    }

    @property({attribute: 'beats-per-bar', type: Number, reflect: true})
    get beatsPerBar(): number { return this._viewModel.beatsPerBar; }
    set beatsPerBar(value: number) {
        const oldValue = this._viewModel.beatsPerBar;
        this._viewModel.beatsPerBar = Math.max(1, Math.round(value));
        this.requestUpdate('beatsPerBar', oldValue);
    }

    @property({attribute: 'divisions-per-beat', type: Number, reflect: true})
    get divisionsPerBeat(): number { return this._viewModel.divisionsPerBeat; }
    set divisionsPerBeat(value: number) {
        const oldValue = this._viewModel.divisionsPerBeat;
        this._viewModel.divisionsPerBeat = Math.max(1, Math.round(value));
        this.requestUpdate('divisionsPerBeat', oldValue);
    }

    private _svg: Ref<SVGElement> = createRef();

    private _svgPoint: SVGPoint | null = null;

    private _getCursorPoint(evt: MouseEvent): {x: number, y: number} {
        const svg: any = this._svg.value;
        const point = this._svgPoint;
        if (!point || !svg)
            return {x: -1, y: -1 };
        point.x = evt.clientX;
        point.y = evt.clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    private _onMouseDown(evt: MouseEvent): void {
        this._behavior.onMouseDown(this._getCursorPoint(evt), evt.button);
    }

    private _onMouseMove(evt: MouseEvent): void {
        this._behavior.onMouseMove(this._getCursorPoint(evt));
    }

    private _onMouseUp(evt: MouseEvent): void {
        this._behavior.onMouseUp(this._getCursorPoint(evt), evt.button);
    }

    private _onMouseLeave(): void {

    }

    firstUpdated() {
        const svg: any = this._svg.value;
        this._svgPoint = svg.createSVGPoint();
    }

    render() {
        const vm = this._viewModel;
        return html`
            <svg :viewBox="0 0 ${vm.clipBeats * vm.beatWidth} ${128 * vm.pitchHeight}"
                preserveAspectRatio="none" fill="#666666"
                ${ref(this._svg)} class="edit-area"
                @mousedown=${this._onMouseDown}
                @mousemove=${this._onMouseMove}
                @mouseup=${this._onMouseUp}
                @mouseleave=${this._onMouseLeave}
                width=${vm.clipBeats * vm.beatWidth}
                height=${128 * vm.pitchHeight}>

                <rect x="0" y="0" 
                    width=${vm.clipBeats * vm.beatWidth}
                    height=${128 * vm.pitchHeight}
                    fill="#666"></rect>

                ${this._renderBlackLines()}

                ${this._renderBeatLines()}

                ${this._renderNotes()}
            </svg>
        `;
    }

    private _renderBlackLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (let p = 127; p >= 0; p--) {
            if (vm.pitchIsBlack(p)) {
                output.push(svg`
                    <rect x="0" y=${vm.getYFromPitch(p)}
                        width=${vm.clipBeats * vm.beatWidth}
                        height=${vm.pitchHeight}
                        fill="#555"></rect>
                `);
            }
        }
        return output;
    }

    private _renderBeatLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const line of vm.getBeatLines()) {
            output.push(svg`
                <line x1=${line.beat * vm.beatWidth} y1="-10" 
                    x2=${line.beat * vm.beatWidth} y2=${128 * vm.pitchHeight}
                    class=${line.class}/>
            `);
        }
        return output;
    }

    private _renderNotes(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const note of this.clip?.notes ?? []) {
            output.push(svg`
                <rect x=${note.start * vm.beatWidth}
                    y=${vm.getYFromPitch(note.pitch)}
                    height=${vm.pitchHeight}
                    width=${note.duration * vm.beatWidth}
                    stroke="black" stroke-width="0.5"
                    fill="green"></rect>
            `);
        }
        return output;
    }

    static styles = css`
        .bar-line {
            stroke: #303030;
            stroke-width: 2;
            stroke-dasharray: 5,0;
        }

        .beat-line {
            stroke: #E0E0E0;
            stroke-width: 1;
            stroke-dasharray: 5,0;
        }

        .division-line {
            stroke: #A0A0A0;
            stroke-width: 1;
            stroke-dasharray: 2,5;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'clip-editor': ClipEditor
    }
}