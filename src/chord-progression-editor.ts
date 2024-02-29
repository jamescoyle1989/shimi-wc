import { LitElement, TemplateResult, css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { ChordProgressionEditorViewModel } from './ChordProgressionEditorViewModel';
import { ChordProgression, Scale } from 'shimi';

/** Contains attributes and rendering logic */
@customElement('chord-progression-editor')
export class ChordProgressionEditor extends LitElement {

    private _viewModel: ChordProgressionEditorViewModel = new ChordProgressionEditorViewModel();

    constructor() {
        super();
    }

    @property({attribute: false})
    get chordProgression(): ChordProgression { return this._viewModel.chordProgression; }
    set chordProgression(value: ChordProgression) {
        const oldValue = this._viewModel.chordProgression;
        this._viewModel.chordProgression = value;
        this.requestUpdate('chordProgression', oldValue);
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

    @property({attribute: 'width', type: Number})
    get width(): number { return this._viewModel.totalWidth; }
    set width(value: number) {
        const oldValue = this._viewModel.totalWidth;
        this._viewModel.totalWidth = value;
        this.requestUpdate('width', oldValue);
    }

    @property({attribute: 'height', type: Number})
    get height(): number { return this._viewModel.totalHeight; }
    set height(value: number) {
        const oldValue = this._viewModel.totalHeight;
        this._viewModel.totalHeight = value;
        this.requestUpdate('height', oldValue);
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

    @property({attribute: 'snap-strength', type: Number, reflect: true})
    get snapStrength(): number { return this._viewModel.snapStrength; }
    set snapStrength(value: number) {
        const oldValue = this._viewModel.snapStrength;
        this._viewModel.snapStrength = Math.min(Math.max(0, value), 1);
        this.requestUpdate('snapStrength', oldValue);
    }

    @property({attribute: false})
    get scale(): Scale { return this._viewModel.scale; }
    set scale(value: Scale) {
        const oldValue = this._viewModel.scale;
        this._viewModel.scale = value;
        this.requestUpdate('scale', oldValue);
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

    firstUpdated() {
        const svg: any = this._svg.value;
        this._svgPoint = svg.createSVGPoint();
    }

    render() {
        const vm = this._viewModel;
        return html`
            <svg xmlns="http://www.w3.org/2000/svg"
                :viewBox="0 0 ${vm.totalWidth} ${vm.totalHeight}"
                preserveAspectRatio="none" file="#666666"
                ${ref(this._svg)} class="edit-area"
                width=${vm.totalWidth}
                height=${vm.totalHeight}>

                <rect x="0" y="0"
                    width=${vm.totalWidth}
                    height=${vm.totalHeight}
                    fill="#666"></rect>

                ${this._renderBeatLines()}
                ${this._renderChords()}
            </svg>
        `;
    }

    private _renderBeatLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const line of vm.getBeatLines()) {
            output.push(svg`
                <line x1=${line.beat * vm.beatWidth} y1="0" 
                    x2=${line.beat * vm.beatWidth} y2=${vm.totalHeight}
                    class=${line.class}/>
            `);
        }
        return output;
    }

    private _renderChords(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const chord of vm.chordProgression?.chords ?? []) {
            output.push(svg`
                <rect x=${chord.start * vm.beatWidth} y="0"
                        width=${chord.duration * vm.beatWidth} height=${vm.totalHeight}
                        stroke="black" stroke-width="0.5" fill="#FF888888">
                </rect>
            `);
            output.push(svg`
                <foreignObject x=${(chord.start * vm.beatWidth) + 20} y="20"
                        width=${Math.min(100, (chord.duration * vm.beatWidth) - 40)}
                        height="50">
                    <input xmlns="http://www.w3.org/1999/xhtml"
                            type="text" value=${chord.chord.name}>
                    </input>
                </foreignObject>
            `);
        }
        return output;
    }

    static styles = css`
        .edit-area {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -ms-user-select: none;
        }

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