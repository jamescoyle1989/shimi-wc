import { Chord, ChordFinder, ChordProgression, Scale, ScaleTemplate, ChordProgressionChord } from 'shimi';

/** Contains values that ChordProgressionEditor properties depend on, as well as helper properties & methods */
export class ChordProgressionEditorViewModel {
    chordProgression: ChordProgression = null;

    chordFinder: ChordFinder = new ChordFinder().withDefaultChordLookups();

    xZoom: number = 1;

    yZoom: number = 1;

    beatsPerBar: number = 4;

    divisionsPerBeat: number = 2;

    //0.05 = that given the number of beats from one division to the next, we need to be within 5% of that distance from a division line to snap to it
    snapStrength: number = 0.05;

    scale: Scale = ScaleTemplate.major.create('C');

    get beatWidth(): number { return 100 * this.xZoom; }
    set beatWidth(value: number) { this.xZoom = value / 100; }

    get chordHeight(): number { return 200 * this.yZoom; }
    set chordHeight(value: number) { this.yZoom = value / 200; }

    get totalBeats(): number { return this.chordProgression?.duration ?? 0; }

    get beatsPerDivision(): number { return 1 / this.divisionsPerBeat; }

    get totalWidth(): number { return this.totalBeats * this.beatWidth; }
    set totalWidth(value: number) {
        if (this.totalBeats <= 0)
            return;
        this.beatWidth = value / this.totalBeats;
    }

    get totalHeight(): number { return this.chordHeight; }
    set totalHeight(value: number) {
        this.chordHeight = value;
    }


    getXFromBeat(beat: number): number {
        return beat * this.beatWidth;
    }

    getBeatFromX(x: number): number {
        return Math.min(Math.max(0, x / this.beatWidth), this.totalBeats);
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
            output.push(new ChordProgressionChord(0, this.chordProgression.duration, new Chord()));
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
            if (lastChord.end < this.chordProgression.duration)
                output.push(new ChordProgressionChord(lastChord.end, this.chordProgression.duration - lastChord.end, new Chord()));
        }
        return output;
    }
}