import { LitElement, TemplateResult, css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Clip, ClipNote, Scale, pitch } from 'shimi';
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

    @property({attribute: 'min-pitch', type: String, reflect: true})
    get minPitch(): number | string { return this._viewModel.minPitch; }
    set minPitch(value: number | string) {
        const oldValue = this._viewModel.minPitch;
        if (typeof value === 'string') {
            try { value = pitch(value); } catch (err1) {
                try { value = Number(value); } catch (err2) { return; }
            }
        }
        this._viewModel.minPitch = Math.max(0, Math.round(value));
        this.requestUpdate('minPitch', oldValue);
    }

    @property({attribute: 'max-pitch', type: String, reflect: true})
    get maxPitch(): number | string { return this._viewModel.maxPitch; }
    set maxPitch(value: number | string) {
        const oldValue = this._viewModel.maxPitch;
        if (typeof value === 'string') {
            try { value = pitch(value); } catch (err1) {
                try { value = Number(value); } catch (err2) { return; }
            }
        }
        this._viewModel.maxPitch = Math.min(127, Math.round(value));
        this.requestUpdate('maxPitch', oldValue);
    }

    @property({attribute: false})
    get pitchFilter(): ((pitch: number) => boolean) | null { return this._viewModel.pitchFilter; }
    set pitchFilter(value: ((pitch: number) => boolean) | Scale | null) {
        const oldValue = this._viewModel.pitchFilter;
        if (value != null) {
            const scale = value as Scale;
            if (scale.contains != undefined)
                value = (p: number) => scale.contains(p);
        }
        this._viewModel.pitchFilter = value as (((pitch: number) => boolean) | null);
        this.requestUpdate('pitchFilter', oldValue);
    }

    @property({attribute: false})
    get noteColor(): (note: ClipNote, isSelected: boolean) => string { return this._viewModel.noteColor; }
    set noteColor(value: (note: ClipNote, isSelected: boolean) => string) {
        const oldValue = this._viewModel.noteColor;
        this._viewModel.noteColor = value;
        this.requestUpdate('noteColor', oldValue);
    }

    @property({attribute: false})
    get canAddNote(): (note: ClipNote) => boolean { return this._viewModel.canAddNote; }
    set canAddNote(value: (note: ClipNote) => boolean) {
        const oldValue = this._viewModel.canAddNote;
        this._viewModel.canAddNote = value;
        this.requestUpdate('canAddNote', oldValue);
    }

    @property({attribute: false})
    get canEditNoteStart(): (note: ClipNote) => boolean { return this._viewModel.canEditNoteStart; }
    set canEditNoteStart(value: (note: ClipNote) => boolean) {
        const oldValue = this._viewModel.canEditNoteStart;
        this._viewModel.canEditNoteStart = value;
        this.requestUpdate('canEditNoteStart', oldValue);
    }

    @property({attribute: false})
    get canEditNoteEnd(): (note: ClipNote) => boolean { return this._viewModel.canEditNoteEnd; }
    set canEditNoteEnd(value: (note: ClipNote) => boolean) {
        const oldValue = this._viewModel.canEditNoteEnd;
        this._viewModel.canEditNoteEnd = value;
        this.requestUpdate('canEditNoteEnd', oldValue);
    }

    @property({attribute: false})
    get canEditNotePitch(): (note: ClipNote) => boolean { return this._viewModel.canEditNotePitch; }
    set canEditNotePitch(value: (note: ClipNote) => boolean) {
        const oldValue = this._viewModel.canEditNotePitch;
        this._viewModel.canEditNotePitch = value;
        this.requestUpdate('canEditNotePitch', oldValue);
    }

    @property({attribute: false})
    get canDeleteNote(): (note: ClipNote) => boolean { return this._viewModel.canDeleteNote; }
    set canDeleteNote(value: (note: ClipNote) => boolean) {
        const oldValue = this._viewModel.canDeleteNote;
        this._viewModel.canDeleteNote = value;
        this.requestUpdate('canDeleteNote', oldValue);
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

    private _onMouseLeave(evt: MouseEvent): void {
        this._behavior.onMouseLeave(this._getCursorPoint(evt), evt.button);
    }

    private _onDoubleClick(evt: MouseEvent): void {
        this._behavior.onDoubleClick(this._getCursorPoint(evt));
    }

    firstUpdated() {
        const svg: any = this._svg.value;
        this._svgPoint = svg.createSVGPoint();
    }

    render() {
        const vm = this._viewModel;
        return html`
            <svg :viewBox="0 0 ${vm.clipBeats * vm.beatWidth} ${vm.pitches.length * vm.pitchHeight}"
                preserveAspectRatio="none" fill="#666666"
                ${ref(this._svg)} class="edit-area"
                @mousedown=${this._onMouseDown}
                @mousemove=${this._onMouseMove}
                @mouseup=${this._onMouseUp}
                @mouseleave=${this._onMouseLeave}
                @dblclick=${this._onDoubleClick}
                width=${vm.clipBeats * vm.beatWidth}
                height=${vm.pitches.length * vm.pitchHeight}>

                <rect x="0" y="0" 
                    width=${vm.clipBeats * vm.beatWidth}
                    height=${vm.pitches.length * vm.pitchHeight}
                    fill="#666"></rect>

                ${this._renderBlackLines()}

                ${this._renderPitchSeparatorLines()}

                ${this._renderBeatLines()}

                ${this._renderPitchNames()}

                ${this._renderNotes()}
            </svg>
        `;
    }

    private _renderBlackLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const p of vm.pitches) {
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

    private _renderPitchSeparatorLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        if (vm.pitches.length == 0)
            return output;
        let isPreviousPitchBlack = vm.pitchIsBlack(vm.pitches[0]);
        for (let i = 1; i < vm.pitches.length; i++) {
            const pitch = vm.pitches[i];
            const isCurrentPitchBlack = vm.pitchIsBlack(pitch);
            if (isPreviousPitchBlack == isCurrentPitchBlack) {
                output.push(svg`
                    <line x1="0" y1=${i * vm.pitchHeight}
                        x2=${vm.clipBeats * vm.beatWidth} y2=${i * vm.pitchHeight}
                        class="pitch-separator-line"/>
                `);
            }
            isPreviousPitchBlack = isCurrentPitchBlack;
        }
        return output;
    }

    private _renderBeatLines(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];
        for (const line of vm.getBeatLines()) {
            output.push(svg`
                <line x1=${line.beat * vm.beatWidth} y1="0" 
                    x2=${line.beat * vm.beatWidth} y2=${vm.pitches.length * vm.pitchHeight}
                    class=${line.class}/>
            `);
        }
        return output;
    }

    private _renderPitchNames(): Array<TemplateResult> {
        const vm = this._viewModel;
        const output: Array<TemplateResult> = [];

        const textStyle = { fontSize: (vm.pitchHeight - 2) + 'px' };

        for (const line of vm.getBeatLines().filter(x => x.beat == 0 || x.class == 'bar-line')) {
            for (const c of vm.pitches.filter(x => (x % 12) == 0)) {
                output.push(svg`
                    <text x=${(line.beat * vm.beatWidth) + 2}
                          y=${(vm.getYFromPitch(c) + vm.pitchHeight) - (vm.pitchHeight / 5)}
                          style=${styleMap(textStyle)}
                          class="pitch-label">
                        ${vm.scale.getPitchName(c, true)}
                    </text>
                `);
            }
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
                    fill=${vm.noteColor(note, note === vm.selectedNote)}></rect>
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

        .pitch-separator-line {
            stroke: #5E5E5E;
            stroke-width: 1;
        }

        .pitch-label {
            fill: #FFFFFF99;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            font-size: 20px;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'clip-editor': ClipEditor
    }
}