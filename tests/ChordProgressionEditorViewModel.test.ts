import { expect, test } from 'vitest';
import { ChordProgressionEditorViewModel } from '../src/ChordProgressionEditorViewModel';
import { Chord, ChordProgression, ScaleTemplate } from 'shimi';

test('get totalBeats defaults to 0 if chordProgression not set', () => {
    const vm = new ChordProgressionEditorViewModel();
    expect(vm.totalBeats).toBe(0);
});

test('get beatsPerLine returns totalBeats if maxBeatsPerLine not set', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(16);
    expect(vm.beatsPerLine).toBe(16);
});

test('get beatsPerLine returns min of totalBeats & maxBeatsPerLine', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(5);
    vm.maxBeatsPerLine = 4;
    expect(vm.beatsPerLine).toBe(4);
    vm.maxBeatsPerLine = 8;
    expect(vm.beatsPerLine).toBe(5);
});

test('set totalWidth modifies beatWidth', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(4);
    vm.totalWidth = 80;
    expect(vm.beatWidth).toBe(20);
});

test('set totalWidth does nothing if there are zero beats', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.beatWidth = 567;
    vm.totalWidth = 99999;
    expect(vm.beatWidth).toBe(567);
});

test('get lineCount returns 1 if maxBeatsPerLine not set', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(500);
    expect(vm.lineCount).toBe(1);
});

test('get lineCount returns ceiling of total beats over beats per line value', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(11);
    vm.maxBeatsPerLine = 4;
    expect(vm.lineCount).toBe(3);
});

test('get totalHeight returns correct buffered line heights', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.chordHeight = 13;
    vm.lineBufferHeight = 5;
    vm.maxBeatsPerLine = 4;
    expect(vm.totalHeight).toBe(26 + 5)
});

test('set totalHeight updates chordHeight & lineBufferHeight proportionally', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.chordHeight = 80;
    vm.lineBufferHeight = 40;
    vm.maxBeatsPerLine = 4;
    expect(vm.totalHeight).toBe(200);
    vm.totalHeight = 150;
    expect(vm.chordHeight).toBe(60);
    expect(vm.lineBufferHeight).toBe(30);
});

test('getXFromBeat works on single line layouts', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.beatWidth = 100;
    expect(vm.getXFromBeat(2.5)).toBe(250);
    expect(vm.getXFromBeat(6)).toBe(600);
});

test('getXFromBeat works on multi line layouts', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.maxBeatsPerLine = 4;
    vm.beatWidth = 100;
    expect(vm.getXFromBeat(2.5)).toBe(250);
    expect(vm.getXFromBeat(6)).toBe(200);
});

test('getYFromBeat returns zero for single line layouts', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.chordHeight = 100;
    vm.lineBufferHeight = 50;
    expect(vm.getYFromBeat(2.5)).toBe(0);
    expect(vm.getYFromBeat(6)).toBe(0);
});

test('getYFromBeat works on multi line layouts', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.maxBeatsPerLine = 4;
    vm.chordHeight = 100;
    vm.lineBufferHeight = 50;
    expect(vm.getYFromBeat(2.5)).toBe(0);
    expect(vm.getYFromBeat(6)).toBe(150);
});

test('getBeatFromXY returns -1 if in line buffer region', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.maxBeatsPerLine = 4;
    vm.chordHeight = 100;
    vm.lineBufferHeight = 50;
    expect(vm.getBeatFromXY({x: 100, y: 125})).toBe(-1);
});

test('getBeatFromXY returns correct beat', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.maxBeatsPerLine = 4;
    vm.chordHeight = 100;
    vm.lineBufferHeight = 50;
    expect(vm.getBeatFromXY({x: 250, y: 75})).toBe(2.5);
    expect(vm.getBeatFromXY({x: 200, y: 150})).toBe(6);
});

test('getBeatLines returns correct values', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8);
    vm.divisionsPerBeat = 4;
    vm.beatsPerBar = 3;

    const result = vm.getBeatLines();
    const barLines = result.filter(x => x.class == 'bar-line');
    barLines.sort((a, b) => a.beat - b.beat);
    const beatLines = result.filter(x => x.class == 'beat-line');
    beatLines.sort((a, b) => a.beat - b.beat);
    const divisionLines = result.filter(x => x.class == 'division-line');
    divisionLines.sort((a, b) => a.beat - b.beat);

    expect(barLines.length).toBe(3);
    expect(barLines[0].beat).toBe(0);
    expect(barLines[1].beat).toBe(3);
    expect(barLines[2].beat).toBe(6);

    expect(beatLines.length).toBe(6);
    expect(beatLines[0].beat).toBe(1);
    expect(beatLines[1].beat).toBe(2);
    expect(beatLines[2].beat).toBe(4);
    expect(beatLines[3].beat).toBe(5);
    expect(beatLines[4].beat).toBe(7);
    expect(beatLines[5].beat).toBe(8);

    expect(divisionLines.length).toBe(8 * 3);
    expect(divisionLines[0].beat).toBe(0.25);
    expect(divisionLines[1].beat).toBe(0.5);
    expect(divisionLines[2].beat).toBe(0.75);
    expect(divisionLines[21].beat).toBe(7.25);
    expect(divisionLines[22].beat).toBe(7.5);
    expect(divisionLines[23].beat).toBe(7.75);
});

test('getNearestDivisionBeat returns correct value', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 4;

    expect(vm.getNearestDivisionBeat(1.27)).toBe(1.25);
    expect(vm.getNearestDivisionBeat(3.09)).toBe(3);
    expect(vm.getNearestDivisionBeat(0.99)).toBe(1);
});

test('getPreviousDivisionBeat returns correct value', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 4;

    expect(vm.getPreviousDivisionBeat(1.27)).toBe(1.25);
    expect(vm.getPreviousDivisionBeat(3.09)).toBe(3);
    expect(vm.getPreviousDivisionBeat(0.99)).toBe(0.75);
});

test('getNextDivisionBeat returns correct value', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 4;

    expect(vm.getNextDivisionBeat(1.27)).toBe(1.5);
    expect(vm.getNextDivisionBeat(3.09)).toBe(3.25);
    expect(vm.getNextDivisionBeat(0.99)).toBe(1);
});

test('getSnappedBeat returns input value if zero snapStrength', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 1;
    vm.snapStrength = 0;

    expect(vm.getSnappedBeat(0)).toBe(0);
    expect(vm.getSnappedBeat(0.01)).toBe(0.01);
    expect(vm.getSnappedBeat(0.99)).toBe(0.99);
    expect(vm.getSnappedBeat(1)).toBe(1);
});

test('getSnappedBeat can snap with 1% strength', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 1;
    vm.snapStrength = 0.01;

    expect(vm.getSnappedBeat(0.01)).toBe(0);
    expect(vm.getSnappedBeat(0.02)).toBe(0.02);
    expect(vm.getSnappedBeat(0.98)).toBe(0.98);
    expect(vm.getSnappedBeat(0.99001)).toBe(1);
});

test('getSnappedBeat can snap with 10% strength', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 1;
    vm.snapStrength = 0.1;

    expect(vm.getSnappedBeat(0.1)).toBe(0);
    expect(vm.getSnappedBeat(0.11)).toBe(0.11);
    expect(vm.getSnappedBeat(0.89)).toBe(0.89);
    expect(vm.getSnappedBeat(0.9)).toBe(1);
});

test('getSnappedBeat can snap with 50% strength', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.divisionsPerBeat = 1;
    vm.snapStrength = 0.5;

    expect(vm.getSnappedBeat(0.4999)).toBe(0);
    expect(vm.getSnappedBeat(0.5)).toBe(1);
});

test('getChordNoteNamesLabel returns comma-separated chord pitches', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.scale = ScaleTemplate.major.create('C');
    vm.chordProgression = new ChordProgression(8)
        .addChord(0, 4, new Chord().setRoot('C4').addPitches(['E4', 'G4', 'C5']));
    expect(vm.getChordNoteNamesLabel(vm.chordProgression.chords[0])).toBe('C,E,G');
});

test('getChordGaps returns collection of gaps between chords', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(8)
        .addChord(0.5, 1.5, new Chord())    //0.5 - 2
        .addChord(2, 1.5, new Chord())      //2 - 3.5
        .addChord(4.5, 2.5, new Chord());   //4.5 - 7
    const gaps = vm.getChordGaps();
    expect(gaps.length).toBe(3);
    expect(gaps[0].start).toBe(0);
    expect(gaps[0].duration).toBe(0.5);
    expect(gaps[1].start).toBe(3.5);
    expect(gaps[1].duration).toBe(1);
    expect(gaps[2].start).toBe(7);
    expect(gaps[2].duration).toBe(1);
});

test('getChordLineSectionBeats correctly handles chord wrapping over 1 line', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(16)
        .addChord(3, 4, new Chord());
    vm.maxBeatsPerLine = 4;
    const chordSections = vm.getChordLineSectionBeats(vm.chordProgression.chords[0]);
    expect(chordSections.length).toBe(2);
    expect(chordSections[0].start).toBe(3);
    expect(chordSections[0].end).toBe(4);
    expect(chordSections[1].start).toBe(4);
    expect(chordSections[1].end).toBe(7);
});

test('getChordLineSectionBeats correctly handles chord wrapping over several lines', () => {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = new ChordProgression(16)
        .addChord(3, 8, new Chord());
    vm.maxBeatsPerLine = 4;
    const chordSections = vm.getChordLineSectionBeats(vm.chordProgression.chords[0]);
    expect(chordSections.length).toBe(3);
    expect(chordSections[0].start).toBe(3);
    expect(chordSections[0].end).toBe(4);
    expect(chordSections[1].start).toBe(4);
    expect(chordSections[1].end).toBe(8);
    expect(chordSections[2].start).toBe(8);
    expect(chordSections[2].end).toBe(11);
});