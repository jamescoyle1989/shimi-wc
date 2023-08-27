import { Clip, ClipNote } from 'shimi';

/** Contains values that ClipEditor properties depend on, as well as helper properties & methods */
export class ClipEditorViewModel {
    clip: Clip | null = null;

    xZoom: number = 1;

    yZoom: number = 1;

    beatsPerBar: number = 4;

    divisionsPerBeat: number = 2;

    //0.05 = that given the number of beats from one division to the next, we need to be within 5% of that distance from a division line to snap to it
    snapPercent: number = 0.05;

    //0.2 = you can grab the initial 20% of a note to stretch it from the start, or the final 20% of a note to stretch it from the end. Grab it anywhere else and you'll move the whole note
    noteGrabEndsPercent: number = 0.2;

    selectedNote: ClipNote | null = null;

    get beatWidth(): number { return 50 * this.xZoom; }

    get pitchHeight(): number { return 10 * this.yZoom; }

    get clipBeats(): number { return this.clip?.duration ?? 0; }

    get beatsPerDivision(): number { return 1 / this.divisionsPerBeat; }

    pitchIsBlack(pitch: number): boolean {
        const m = pitch % 12;
        return m == 1 || m == 3 || m == 6 || m == 8 || m == 10;
    }

    getXFromBeat(beat: number): number {
        return beat * this.beatWidth;
    }

    getBeatFromX(x: number): number {
        return Math.min(this.clip?.duration ?? 0, Math.max(0, x / this.beatWidth));
    }

    getYFromPitch(pitch: number): number {
        return (127 - pitch) * this.pitchHeight;
    }

    getPitchFromY(y: number): number {
        return Math.min(127, Math.max(0, 127 - Math.floor(y / this.pitchHeight)));
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
        for (let barStart = 0; barStart < this.clipBeats; barStart += this.beatsPerBar) {
            for (const line of linesPerBar) {
                const lineBeat = barStart + line.beat;
                if (lineBeat >= 0 && lineBeat <= this.clipBeats)
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
        if (Math.abs(beat - nearestDivision) <= (this.beatsPerDivision * this.snapPercent))
            return nearestDivision;
        return beat;
    }
}