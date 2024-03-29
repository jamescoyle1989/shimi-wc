import { Clip, ClipNote, Scale, ScaleTemplate } from 'shimi';
import chroma from 'chroma-js';
import { ClipEditorPlayhead } from './ClipEditorPlayhead';

/** Contains values that ClipEditor properties depend on, as well as helper properties & methods */
export class ClipEditorViewModel {
    clip: Clip | null = null;

    xZoom: number = 1;

    yZoom: number = 1;

    beatsPerBar: number = 4;

    divisionsPerBeat: number = 2;

    //0.05 = that given the number of beats from one division to the next, we need to be within 5% of that distance from a division line to snap to it
    snapStrength: number = 0.05;

    //0.2 = you can grab the initial 20% of a note to stretch it from the start, or the final 20% of a note to stretch it from the end. Grab it anywhere else and you'll move the whole note
    noteResizeHandleArea: number = 0.2;

    selectedNote: ClipNote | null = null;

    playheads: Array<ClipEditorPlayhead> = [];

    private _minPitch: number = 0;
    get minPitch(): number { return this._minPitch; }
    set minPitch(value: number) {
        if (value == this._minPitch)
            return;
        this._minPitch = value;
        this._pitchesCache = null;
    }

    private _maxPitch: number = 127;
    get maxPitch(): number { return this._maxPitch; }
    set maxPitch(value: number) {
        if (value == this._maxPitch)
            return;
        this._maxPitch = value;
        this._pitchesCache = null;
    }

    private _scale: Scale = ScaleTemplate.major.create('C');
    get scale(): Scale { return this._scale; }
    set scale(value: Scale) {
        if (value === this._scale)
            return;
        this._scale = value;
        this._pitchesCache = null;
    }

    private _filterPitchesByScale: boolean = false;
    get filterPitchesByScale(): boolean { return this._filterPitchesByScale; }
    set filterPitchesByScale(value: boolean) {
        if (value == this._filterPitchesByScale)
            return;
        this._filterPitchesByScale = value;
        this._pitchesCache = null;
    }

    private _customPitchNames: Map<number, string> = null;
    get customPitchNames(): Map<number, string> { return this._customPitchNames; }
    set customPitchNames(value: Map<number, string>) {
        if (value == this._customPitchNames)
            return;
        this._customPitchNames = value;
        this._pitchesCache = null;
    }
    
    private _pitchesCache: Array<number> | null = null;
    get pitches(): Array<number> {
        if (this._pitchesCache == null) {
            const output = [];
            if (!!this.customPitchNames) {
                for (const pitch of this.customPitchNames.keys())
                    output.push(pitch);
                output.sort((a, b) => b - a);
            }
            else {
                for (let i = this.maxPitch; i >= this.minPitch; i--) {
                    if (!this.filterPitchesByScale || this.scale.contains(i))
                        output.push(i);
                }
            }
            this._pitchesCache = output;
        }
        return this._pitchesCache;
    }

    noteColor: (note: ClipNote, isSelected: boolean) => string = this._defaultNoteColor;

    canAddNote: (note: ClipNote) => boolean = n => true;

    canEditNoteStart: (note: ClipNote) => boolean = n => true;

    canEditNoteEnd: (note: ClipNote) => boolean = n => true;

    canEditNotePitch: (note: ClipNote) => boolean = n => true;

    canDeleteNote: (note: ClipNote) => boolean = n => true;

    get beatWidth(): number { return 100 * this.xZoom; }
    set beatWidth(value: number) { this.xZoom = value / 100; }

    get pitchHeight(): number { return 20 * this.yZoom; }
    set pitchHeight(value: number) { this.yZoom = value / 20; }

    get totalBeats(): number { return this.clip?.duration ?? 0; }

    get beatsPerDivision(): number { return 1 / this.divisionsPerBeat; }

    get totalWidth(): number { return this.totalBeats * this.beatWidth; }
    set totalWidth(value: number) {
        if (this.totalBeats <= 0)
            return;
        this.beatWidth = value / this.totalBeats;
    }

    get totalHeight(): number {
        if (!this.clip)
            return 0;
        return this.pitches.length * this.pitchHeight;
    }
    set totalHeight(value: number) {
        if (!this.clip)
            return;
        this.pitchHeight = value / this.pitches.length;
    }

    pitchIsBlack(pitch: number): boolean {
        const m = pitch % 12;
        return m == 1 || m == 3 || m == 6 || m == 8 || m == 10;
    }

    getPitchName(pitch: number): string {
        if (!!this.customPitchNames)
            return this.customPitchNames.get(pitch) ?? '';
        return this.scale.getPitchName(pitch, true);
    }

    getXFromBeat(beat: number): number {
        return beat * this.beatWidth;
    }

    getBeatFromX(x: number): number {
        return Math.min(this.totalBeats, Math.max(0, x / this.beatWidth));
    }

    getYFromPitch(pitch: number): number {
        return this.pitches.indexOf(pitch) * this.pitchHeight;
    }

    getPitchFromY(y: number): number {
        const index = Math.floor(y / this.pitchHeight);
        if (index < 0 || index >= this.pitches.length)
            return 0;
        return Math.min(127, Math.max(0, this.pitches[index]));
    }

    getBeatLines(): Array<{beat: number, class: string}> {
        const linesPerBar = [{ beat: 0, class: 'bar-line' }];
        for (let i = 0; i < this.beatsPerBar; i++) {
            if (i > 0)
                linesPerBar.push({ beat: i, class: 'beat-line' });
            for (let j = 1; j < this.divisionsPerBeat; j++)
                linesPerBar.push({ beat: i + (j / this.divisionsPerBeat), class: 'division-line'});
        }

        const output = [];
        for (let barStart = 0; barStart < this.totalBeats; barStart += this.beatsPerBar) {
            for (const line of linesPerBar) {
                const lineBeat = barStart + line.beat;
                if (lineBeat >= 0 && lineBeat <= this.totalBeats)
                    output.push({ beat: lineBeat, class: line.class });
            }
        }
        return output;
    }

    getNoteAt(beat: number, pitch: number): ClipNote | null {
        if (!this.clip)
            return null;
        return this.clip.notes.find(n => n.pitch == pitch && n.contains(beat)) ?? null;
    }

    getNearestDivisionBeat(beat: number): number {
        return Math.round(beat * this.divisionsPerBeat) / this.divisionsPerBeat;
    }

    getPreviousDivisionBeat(beat: number): number {
        return Math.floor(beat * this.divisionsPerBeat) / this.divisionsPerBeat;
    }

    getNextDivisionBeat(beat: number): number {
        return Math.ceil(beat * this.divisionsPerBeat) / this.divisionsPerBeat;
    }

    getSnappedBeat(beat: number): number {
        const nearestDivision = this.getNearestDivisionBeat(beat);
        if (Math.abs(beat - nearestDivision) <= (this.beatsPerDivision * this.snapStrength))
            return nearestDivision;
        return beat;
    }

    private _defaultNoteColors: Array<string> = [
        '#f44336',
        '#e81e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722'
    ];
    private _defaultNoteColor(note: ClipNote, isSelected: boolean): string {
        let chromaObj = chroma(this._defaultNoteColors[note.channel % 16]);
        if (isSelected)
            chromaObj = chromaObj.brighten(0.4);
        if (typeof note.velocity === 'number')
            chromaObj = chromaObj.alpha((note.velocity + 128) / 255);
        else
            chromaObj = chromaObj.alpha(0.75);
        return chromaObj.hex();
    }
}