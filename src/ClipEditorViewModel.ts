import { Clip } from 'shimi';

/** Contains values that ClipEditor properties depend on, as well as helper properties & methods */
export class ClipEditorViewModel {
    clip: Clip | null = null;

    xZoom: number = 1;

    yZoom: number = 1;

    beatsPerBar: number = 4;

    divisionsPerBeat: number = 2;

    get beatWidth(): number { return 50 * this.xZoom; }

    get pitchHeight(): number { return 10 * this.yZoom; }

    get clipBeats(): number { return this.clip?.duration ?? 0; }

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
}