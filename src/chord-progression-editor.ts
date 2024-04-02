import { LitElement, TemplateResult, css, html, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { ChordProgressionEditorViewModel } from './ChordProgressionEditorViewModel';
import { ChordFinder, ChordProgression, Scale, ChordProgressionChord, ChordProgressionPlayer } from 'shimi';
import { ChordProgressionEditorBehavior } from './ChordProgressionEditorBehavior';
import { ChordProgressionEditorPlayhead } from './ChordProgressionEditorPlayhead';

/** Contains attributes and rendering logic */
@customElement('chord-progression-editor')
export class ChordProgressionEditor extends LitElement {

    private _viewModel: ChordProgressionEditorViewModel = new ChordProgressionEditorViewModel();

    private _behavior: ChordProgressionEditorBehavior;

    constructor() {
        super();
        this._behavior = new ChordProgressionEditorBehavior(this, this._viewModel);
    }

    @property({attribute: false})
    get chordProgression(): ChordProgression { return this._viewModel.chordProgression; }
    set chordProgression(value: ChordProgression) {
        const oldValue = this._viewModel.chordProgression;
        this._viewModel.chordProgression = value;
        this.requestUpdate('chordProgression', oldValue);
    }

    @property({attribute: false})
    get chordFinder(): ChordFinder { return this._viewModel.chordFinder; }
    set chordFinder(value: ChordFinder) {
        const oldValue = this._viewModel.chordFinder;
        this._viewModel.chordFinder = value;
        this.requestUpdate('chordFinder', oldValue);
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

    @property({attribute: 'max-beats-per-line', type: Number, reflect: true})
    get maxBeatsPerLine(): number { return this._viewModel.maxBeatsPerLine; }
    set maxBeatsPerLine(value: number) {
        const oldValue = this._viewModel.maxBeatsPerLine;
        let newValue = Math.round(value);
        if (newValue <= 0)
            newValue = -1;
        this._viewModel.maxBeatsPerLine = newValue;
        this.requestUpdate('maxBeatsPerLine', oldValue);
    }

    @property({attribute: 'snap-strength', type: Number, reflect: true})
    get snapStrength(): number { return this._viewModel.snapStrength; }
    set snapStrength(value: number) {
        const oldValue = this._viewModel.snapStrength;
        this._viewModel.snapStrength = Math.min(Math.max(0, value), 1);
        this.requestUpdate('snapStrength', oldValue);
    }

    @property({attribute: 'chord-resize-handle-area', type: Number, reflect: true})
    get chordResizeHandleArea(): number { return this._viewModel.chordResizeHandleArea; }
    set chordResizeHandleArea(value: number) {
        const oldValue = this._viewModel.chordResizeHandleArea;
        this._viewModel.chordResizeHandleArea = Math.min(Math.max(0, value), 1);
        this.requestUpdate('chordResizeHandleArea', oldValue);
    }

    @property({attribute: false})
    get scale(): Scale { return this._viewModel.scale; }
    set scale(value: Scale) {
        const oldValue = this._viewModel.scale;
        this._viewModel.scale = value;
        this.requestUpdate('scale', oldValue);
    }

    @property({attribute: false})
    get chordColor(): (chord: ChordProgressionChord, isValid: boolean) => string { return this._viewModel.chordColor; }
    set chordColor(value: (chord: ChordProgressionChord, isValid: boolean) => string) {
        const oldValue = this._viewModel.chordColor;
        this._viewModel.chordColor = value;
        this.requestUpdate('chordColor', oldValue);
    }

    @state()
    private _playheadUpdateTicker: number = 0;

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
        const cursorPoint = this._getCursorPoint(evt);
        this._behavior.onMouseMove(cursorPoint);
    }

    private _onMouseUp(evt: MouseEvent): void {
        this._behavior.onMouseUp(this._getCursorPoint(evt), evt.button);
    }

    private _onMouseLeave(evt: MouseEvent): void {
        this._behavior.onMouseLeave(this._getCursorPoint(evt), evt.button);
    }

    private _onDoubleClick(evt: MouseEvent): void {
        this._behavior.onDoubleClick(this._getCursorPoint(evt));
    }

    addPlayhead(chordProgressionPlayer: ChordProgressionPlayer): ChordProgressionEditorPlayhead {
        if (chordProgressionPlayer.chordProgression != this.chordProgression)
            throw Error('Cannot add a playhead for a chord progression player that\'s playing a different progression than the one being edited');

        const output = new ChordProgressionEditorPlayhead(this, chordProgressionPlayer);
        this._viewModel.playheads.push(output);
        return output;
    }

    markPlayheadsForUpdate(): void {
        this._playheadUpdateTicker = (this._playheadUpdateTicker + 1) % 1000;
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
                preserveAspectRatio="none"
                ${ref(this._svg)} class="edit-area"
                @mousedown=${this._onMouseDown}
                @mousemove=${this._onMouseMove}
                @mouseup=${this._onMouseUp}
                @mouseleave=${this._onMouseLeave}
                @dblclick=${this._onDoubleClick}
                width=${vm.totalWidth}
                height=${vm.totalHeight}>

                ${this._renderRows()}
                ${this._renderBeatLines()}
                ${this._renderChords()}
                ${this._renderChordGaps()}
                ${this._renderPlayheads()}
            </svg>
        `;
    }

    private _renderRows(): Array<TemplateResult> {
        const vm = this._viewModel;
        const rowCount = vm.lineCount;
        const output: Array<TemplateResult> = [];
        for (let row = 0; row < rowCount; row++) {
            const rowStartBeat = row * vm.beatsPerLine;
            const beatsInRow = Math.min(vm.totalBeats - rowStartBeat, vm.beatsPerLine);
            output.push(svg`
                <rect x="0" y=${row * (vm.chordHeight + vm.lineBufferHeight)}
                    width=${beatsInRow * vm.beatWidth}
                    height=${vm.chordHeight}
                    fill="#666"></rect>
            `);
        }
        return output;
    }

    private _renderBeatLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const line of vm.getBeatLines()) {
            const beatX = vm.getXFromBeat(line.beat);
            const beatY = vm.getYFromBeat(line.beat);
            output.push(svg`
                <line x1=${beatX} y1=${beatY}
                    x2=${beatX} y2=${beatY + vm.chordHeight}
                    class=${line.class}/>
            `);
        }
        return output;
    }

    private _getChordColor(chord: ChordProgressionChord): string {
        const vm = this._viewModel;
        const isValid = !vm.chordsIncorrectlyModified.has(chord);
        return vm.chordColor(chord, isValid);
    }

    private _renderChords(): Array<TemplateResult> {
        const vm = this._viewModel;
        const behavior = this._behavior;
        const output: Array<TemplateResult> = [];
        for (const chord of vm.chordProgression?.chords ?? []) {
            const chordSections = vm.getChordLineSectionBeats(chord);
            for (let i = 0; i < chordSections.length; i++) {
                const chordSection = chordSections[i];
                const chordX = vm.getXFromBeat(chordSection.start);
                const chordY = vm.getYFromBeat(chordSection.start);
                output.push(svg`
                    <rect x=${chordX} y=${chordY}
                            width=${(chordSection.end - chordSection.start) * vm.beatWidth} height=${vm.chordHeight}
                            stroke="black" stroke-width="0.5" fill=${this._getChordColor(chord)}>
                    </rect>
                    <text x=${chordX + 5} y=${chordY + 60}>${vm.getChordNoteNamesLabel(chord)}</text>
                `);
                if (i == 0) {
                    output.push(svg`
                        <foreignObject x=${chordX} y=${chordY + 20}
                                width=${Math.min(100, (chordSection.end - chordSection.start) * vm.beatWidth)}
                                height="50">
                            <input xmlns="http://www.w3.org/1999/xhtml"
                                    type="text" value=${chord.chord.name}
                                    @change=${e => behavior.onChordNameChanged(chord, e.target.value)}>
                            </input>
                        </foreignObject>
                    `);
                }
            }
        }
        return output;
    }

    private _renderChordGaps(): Array<TemplateResult> {
        const vm = this._viewModel;
        const behavior = this._behavior;
        const output: Array<TemplateResult> = [];
        for (const nonChord of vm.getChordGaps()) {
            const nonChordX = vm.getXFromBeat(nonChord.start);
            const nonChordY = vm.getYFromBeat(nonChord.start);
            output.push(svg`
                <foreignObject x=${nonChordX} y=${nonChordY + 20}
                        width=${Math.min(100, nonChord.duration * vm.beatWidth)}
                        height="50">
                    <button xmlns="http://www.w3.org/1999/xhtml"
                        @click=${e => behavior.onChordAdded(nonChord)}>Add</button>
                </foreignObject>
            `);
        }
        return output;
    }

    private _renderPlayheads(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const playhead of vm.playheads) {
            const player = playhead.chordProgressionPlayer;
            const beat = (player.startBeat + player.beatsPassed) % this.chordProgression.duration;
            const lineX = vm.getXFromBeat(beat);
            const lineY = vm.getYFromBeat(beat);
            output.push(svg`
                <line x1=${lineX} y1=${lineY} x2=${lineX} y2=${lineY + vm.chordHeight} class="playhead"/>
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

        .playhead {
            stroke: #F02222;
            stroke-width: 2;
        }
    `;
}