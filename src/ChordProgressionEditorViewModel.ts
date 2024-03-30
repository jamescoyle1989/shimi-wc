import { Chord, ChordFinder, ChordProgression, Scale, ScaleTemplate, ChordProgressionChord } from 'shimi';
import { ChordProgressionEditorPlayhead } from './ChordProgressionEditorPlayhead';

/** Contains values that ChordProgressionEditor properties depend on, as well as helper properties & methods */
export class ChordProgressionEditorViewModel {
    chordProgression: ChordProgression = null;

    chordFinder: ChordFinder = new ChordFinder().withDefaultChordLookups();

    xZoom: number = 1;

    yZoom: number = 1;

    beatsPerBar: number = 4;

    divisionsPerBeat: number = 2;

    maxBeatsPerLine: number = -1;

    lineBufferHeight: number = 20;

    //0.05 = that given the number of beats from one division to the next, we need to be within 5% of that distance from a division line to snap to it
    snapStrength: number = 0.05;

    scale: Scale = ScaleTemplate.major.create('C');

    playheads: Array<ChordProgressionEditorPlayhead> = [];

    get beatWidth(): number { return 100 * this.xZoom; }
    set beatWidth(value: number) { this.xZoom = value / 100; }

    get chordHeight(): number { return 100 * this.yZoom; }
    set chordHeight(value: number) { this.yZoom = value / 100; }

    get totalBeats(): number { return this.chordProgression?.duration ?? 0; }

    get beatsPerDivision(): number { return 1 / this.divisionsPerBeat; }

    get beatsPerLine(): number {
        if (this.maxBeatsPerLine <= 0)
            return this.totalBeats;
        return Math.min(this.totalBeats, this.maxBeatsPerLine);
    }

    get totalWidth(): number { return this.beatsPerLine * this.beatWidth; }
    set totalWidth(value: number) {
        const divisor = this.beatsPerLine;
        if (divisor <= 0)
            return;
        this.beatWidth = value / divisor;
    }

    get lineCount(): number {
        if (this.maxBeatsPerLine <= 0)
            return 1;
        return Math.ceil(this.totalBeats / this.maxBeatsPerLine);
    }

    get totalHeight(): number {
        return (this.chordHeight * this.lineCount) + (this.lineBufferHeight * (this.lineCount - 1));
    }
    set totalHeight(value: number) {
        const currentHeight = this.totalHeight;
        if (currentHeight <= 0)
            return;
        const scalar = value / currentHeight;
        this.chordHeight *= scalar;
        this.lineBufferHeight *= scalar;
    }


    getXFromBeat(beat: number): number {
        if (this.maxBeatsPerLine > 0)
            beat = beat % this.maxBeatsPerLine;
        return beat * this.beatWidth;
    }

    getYFromBeat(beat: number): number {
        if (this.totalBeats <= this.beatsPerLine)
            return 0;
        const line = Math.floor(beat / this.beatsPerLine);
        return line * (this.chordHeight + this.lineBufferHeight);
    }

    getBeatFromXY(cartesian: {x: number, y: number}): number {
        const line = Math.floor(cartesian.y / (this.chordHeight + this.lineBufferHeight));
        const positionInLine = cartesian.y - (line * (this.chordHeight + this.lineBufferHeight));
        if (positionInLine > this.chordHeight)
            return -1;
        
        const beatInLine = Math.min(
            Math.max(0, cartesian.x / this.beatWidth),
            this.beatsPerLine
        );
        return beatInLine + (line * this.beatsPerLine);
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

    getChordNoteNamesLabel(chord: ChordProgressionChord): string {
        let output = '';
        const pitches = chord.chord.pitches.map(x => x % 12);
        for (let i = 0; i < pitches.length; i++) {
            const prevIndex = pitches.indexOf(pitches[i]);
            if (prevIndex >= 0 && prevIndex < i)
                continue;
            if (i > 0)
                output += ',';
            output += this.scale.getPitchName(pitches[i]);
        }
        return output;
    }

    chordsIncorrectlyModified = new Set<ChordProgressionChord>();

    getChordGaps(): Array<ChordProgressionChord> {
        const orderedChords = this.chordProgression.chords.sort((a, b) => a.start - b.start);
        const output = new Array<ChordProgressionChord>();
        if (orderedChords.length == 0) {
            output.push(new ChordProgressionChord(0, this.totalBeats, new Chord()));
        }
        else {
            if (orderedChords[0].start > 0)
                output.push(new ChordProgressionChord(0, orderedChords[0].start, new Chord()));
            for (let i = 1; i < orderedChords.length; i++) {
                const prevChord = orderedChords[i-1];
                const nextChord = orderedChords[i];
                if (prevChord.end < nextChord.start)
                    output.push(new ChordProgressionChord(prevChord.end, nextChord.start - prevChord.end, new Chord()));
            }
            const lastChord = orderedChords[orderedChords.length - 1];
            if (lastChord.end < this.totalBeats)
                output.push(new ChordProgressionChord(lastChord.end, this.totalBeats - lastChord.end, new Chord()));
        }
        return output;
    }

    /**
     * Given a chord, returns the beat sections which would need to be separately rendered due to line wrapping
     */
    getChordLineSectionBeats(chord: ChordProgressionChord): Array<{start: number, end: number}> {
        const output: Array<{start: number, end: number}> = [];
        let start = chord.start;
        while (true) {
            const startLine = Math.floor(start / this.beatsPerLine);
            const nextLineBeat = (startLine + 1) * this.beatsPerLine;
            if (nextLineBeat >= this.totalBeats || nextLineBeat >= chord.end) {
                output.push({start, end: chord.end});
                break;
            }
            output.push({start, end: nextLineBeat});
            start = nextLineBeat;
        }
        return output;
    }
}