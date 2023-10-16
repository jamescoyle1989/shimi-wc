import { expect, test } from 'vitest';
import { ClipEditorViewModel } from '../src/ClipEditorViewModel';
import { ScaleTemplate, Clip, ClipNote } from 'shimi';
import chroma from 'chroma-js';

test('pitches defaults to 0 - 127', () => {
    const model = new ClipEditorViewModel();

    expect(model.pitches.length).toBe(128);
    expect(model.pitches[0]).toBe(127);
    expect(model.pitches[127]).toBe(0);
});

test('pitches recalculates after minPitch change', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitches.length).toBe(128);

    model.minPitch = 36;

    expect(model.pitches.length).toBe(92);
    expect(model.pitches[0]).toBe(127);
    expect(model.pitches[91]).toBe(36);
});

test('pitches recalculates after maxPitch change', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitches.length).toBe(128);

    model.maxPitch = 100;

    expect(model.pitches.length).toBe(101);
    expect(model.pitches[0]).toBe(100);
    expect(model.pitches[100]).toBe(0);
});

test('pitches recalculates after filterPitchesByScale change', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitches.length).toBe(128);

    model.filterPitchesByScale = true;

    expect(model.pitches.length).toBe(75);
    expect(model.pitches[74]).toBe(0);
    expect(model.pitches[73]).toBe(2);
    expect(model.pitches[1]).toBe(125);
    expect(model.pitches[0]).toBe(127);
});

test('pitches stays same after scale change if not filtering by scale', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitches.length).toBe(128);

    model.scale = ScaleTemplate.major.create(0);

    expect(model.pitches.length).toBe(128);
});

test('pitches recalculates after scale change if filtering by scale', () => {
    const model = new ClipEditorViewModel();
    model.filterPitchesByScale = true;
    expect(model.pitches[model.pitches.length - 1]).toBe(0);
    expect(model.pitches[0]).toBe(127);

    model.scale = ScaleTemplate.major.create(6);

    expect(model.pitches[model.pitches.length - 1]).toBe(1);
    expect(model.pitches[0]).toBe(126);
});

test('noteColor by default returns same base color for each note in channel', () => {
    const model = new ClipEditorViewModel();

    const color1 = model.noteColor(new ClipNote(0, 1, 17, 80, 0), false);
    const color2 = model.noteColor(new ClipNote(5, 3, 98, 80, 0), false);
    const color3 = model.noteColor(new ClipNote(0, 1, 17, 80, 1), false);

    expect(color1).toBe(color2);
    expect(color1).not.toBe(color3);
});

test('noteColor by default gets more transparent with less velocity', () => {
    const model = new ClipEditorViewModel();

    const color1 = chroma(model.noteColor(new ClipNote(0, 1, 17, 15, 0), false)).rgba();
    const color2 = chroma(model.noteColor(new ClipNote(0, 1, 17, 99, 0), false)).rgba();

    expect(color1[0]).toBe(color2[0]);
    expect(color1[1]).toBe(color2[1]);
    expect(color1[2]).toBe(color2[2]);
    expect(color1[3]).toBeLessThan(color2[3]);
});

test('noteColor by default lightens note if selected', () => {
    const model = new ClipEditorViewModel();

    const unselected = chroma(model.noteColor(new ClipNote(0, 1, 20, 100, 0), false)).rgba();
    const selected = chroma(model.noteColor(new ClipNote(0, 1, 20, 100, 0), true)).rgba();

    expect(selected[0]).toBeGreaterThan(unselected[0]);
    expect(selected[1]).toBeGreaterThan(unselected[1]);
    expect(selected[2]).toBeGreaterThan(unselected[2]);
    expect(selected[3]).toBe(unselected[3]);
});

test('canAddNote by default returns true', () => {
    const model = new ClipEditorViewModel();

    expect(model.canAddNote(new ClipNote(0, 1, 20, 100, 0))).toBe(true);
    expect(model.canAddNote(new ClipNote(5, 1, 20, 100, 0))).toBe(true);
    expect(model.canAddNote(new ClipNote(0, 7, 20, 100, 0))).toBe(true);
    expect(model.canAddNote(new ClipNote(0, 1, 97, 100, 0))).toBe(true);
    expect(model.canAddNote(new ClipNote(0, 1, 20, 127, 0))).toBe(true);
    expect(model.canAddNote(new ClipNote(0, 1, 20, 100, 9))).toBe(true);
});

test('canEditNoteStart by default returns true', () => {
    const model = new ClipEditorViewModel();

    expect(model.canEditNoteStart(new ClipNote(0, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteStart(new ClipNote(5, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteStart(new ClipNote(0, 7, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteStart(new ClipNote(0, 1, 97, 100, 0))).toBe(true);
    expect(model.canEditNoteStart(new ClipNote(0, 1, 20, 127, 0))).toBe(true);
    expect(model.canEditNoteStart(new ClipNote(0, 1, 20, 100, 9))).toBe(true);
});

test('canEditNoteEnd by default returns true', () => {
    const model = new ClipEditorViewModel();

    expect(model.canEditNoteEnd(new ClipNote(0, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteEnd(new ClipNote(5, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteEnd(new ClipNote(0, 7, 20, 100, 0))).toBe(true);
    expect(model.canEditNoteEnd(new ClipNote(0, 1, 97, 100, 0))).toBe(true);
    expect(model.canEditNoteEnd(new ClipNote(0, 1, 20, 127, 0))).toBe(true);
    expect(model.canEditNoteEnd(new ClipNote(0, 1, 20, 100, 9))).toBe(true);
});

test('canEditNotePitch by default returns true', () => {
    const model = new ClipEditorViewModel();

    expect(model.canEditNotePitch(new ClipNote(0, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNotePitch(new ClipNote(5, 1, 20, 100, 0))).toBe(true);
    expect(model.canEditNotePitch(new ClipNote(0, 7, 20, 100, 0))).toBe(true);
    expect(model.canEditNotePitch(new ClipNote(0, 1, 97, 100, 0))).toBe(true);
    expect(model.canEditNotePitch(new ClipNote(0, 1, 20, 127, 0))).toBe(true);
    expect(model.canEditNotePitch(new ClipNote(0, 1, 20, 100, 9))).toBe(true);
});

test('canDeleteNote by default returns true', () => {
    const model = new ClipEditorViewModel();

    expect(model.canDeleteNote(new ClipNote(0, 1, 20, 100, 0))).toBe(true);
    expect(model.canDeleteNote(new ClipNote(5, 1, 20, 100, 0))).toBe(true);
    expect(model.canDeleteNote(new ClipNote(0, 7, 20, 100, 0))).toBe(true);
    expect(model.canDeleteNote(new ClipNote(0, 1, 97, 100, 0))).toBe(true);
    expect(model.canDeleteNote(new ClipNote(0, 1, 20, 127, 0))).toBe(true);
    expect(model.canDeleteNote(new ClipNote(0, 1, 20, 100, 9))).toBe(true);
});

test('beatWidth is 100 * xZoom', () => {
    const model = new ClipEditorViewModel();
    model.xZoom = 1.7;

    expect(model.beatWidth).toBe(170);
});

test('pitchHeight is 20 * yZoom', () => {
    const model = new ClipEditorViewModel();
    model.yZoom = 1.7;
    
    expect(model.pitchHeight).toBe(34);
});

test('clipBeats is zero if no clip set', () => {
    const model = new ClipEditorViewModel();
    
    expect(model.clipBeats).toBe(0);
});

test('clipBeats returns clip duration if set', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(9.5);

    expect(model.clipBeats).toBe(9.5);
});

test('beatsPerDivision is inverse of divisionsPerBeat', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 5;

    expect(model.beatsPerDivision).toBe(1/5);
});

test('totalWidth is 0 if no clip set', () => {
    const model = new ClipEditorViewModel();

    expect(model.totalWidth).toBe(0);
});

test('totalWidth is clipBeats * beatWidth', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(8);

    expect(model.totalWidth).toBe(8 * model.beatWidth);
});

test('totalHeight is 0 if no clip set', () => {
    const model = new ClipEditorViewModel();

    expect(model.totalHeight).toBe(0);
});

test('totalHeight is pitch count * pitchHeight', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(8);
    model.minPitch = 12;
    model.maxPitch = 23;

    expect(model.totalHeight).toBe(12 * model.pitchHeight);
});

test('pitchIsBlack returns correct value', () => {
    const model = new ClipEditorViewModel();

    expect(model.pitchIsBlack(12)).toBe(false);
    expect(model.pitchIsBlack(13)).toBe(true);
    expect(model.pitchIsBlack(14)).toBe(false);
    expect(model.pitchIsBlack(15)).toBe(true);
    expect(model.pitchIsBlack(16)).toBe(false);
    expect(model.pitchIsBlack(17)).toBe(false);
    expect(model.pitchIsBlack(18)).toBe(true);
    expect(model.pitchIsBlack(19)).toBe(false);
    expect(model.pitchIsBlack(20)).toBe(true);
    expect(model.pitchIsBlack(21)).toBe(false);
    expect(model.pitchIsBlack(22)).toBe(true);
    expect(model.pitchIsBlack(23)).toBe(false);
    expect(model.pitchIsBlack(24)).toBe(false);
});

test('getXFromBeat returns value * beatWidth', () => {
    const model = new ClipEditorViewModel();

    expect(model.getXFromBeat(8)).toBe(8 * model.beatWidth);
});

test('getBeatFromX returns value / beatWidth & capped within clip duration', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(4);
    expect(model.beatWidth).toBe(100);

    expect(model.getBeatFromX(200)).toBe(2);
    expect(model.getBeatFromX(-100)).toBe(0);
    expect(model.getBeatFromX(500)).toBe(4);
});

test('getYFromPitch returns correct value', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitchHeight).toBe(20);

    expect(model.getYFromPitch(127)).toBe(0);
    expect(model.getYFromPitch(126)).toBe(20);
});

test('getPitchFromY returns correct value', () => {
    const model = new ClipEditorViewModel();
    expect(model.pitchHeight).toBe(20);

    expect(model.getPitchFromY(-55)).toBe(0);
    expect(model.getPitchFromY(0)).toBe(127);
    expect(model.getPitchFromY(17)).toBe(127);
    expect(model.getPitchFromY(27)).toBe(126);
    expect(model.getPitchFromY(40)).toBe(125);
    expect(model.getPitchFromY(4000000)).toBe(0);
});

test('getBeatLines returns correct values', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(8);
    model.divisionsPerBeat = 4;
    model.beatsPerBar = 3;

    const result = model.getBeatLines();
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

test('getNoteAt returns null if no clip set', () => {
    const model = new ClipEditorViewModel();

    expect(model.getNoteAt(1, 1)).toBeNull();
});

test('getNoteAt returns null if no note at specified location', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(4)
        .addNote(1, 1, 12, 80);

    expect(model.getNoteAt(0.9, 12)).toBeNull();
});

test('getNoteAt returns note if found at specified location', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(4)
        .addNote([0, 2], 1, [12, 24], 80);
    expect(model.clip.notes.length).toBe(4);

    const note = model.getNoteAt(0, 12) as ClipNote;

    expect(note.start).toBe(0);
    expect(note.pitch).toBe(12);
});

test('getNearestDivisionBeat returns correct value', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 4;

    expect(model.getNearestDivisionBeat(1.27)).toBe(1.25);
    expect(model.getNearestDivisionBeat(3.09)).toBe(3);
    expect(model.getNearestDivisionBeat(0.99)).toBe(1);
});

test('getPreviousDivisionBeat returns correct value', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 4;

    expect(model.getPreviousDivisionBeat(1.27)).toBe(1.25);
    expect(model.getPreviousDivisionBeat(3.09)).toBe(3);
    expect(model.getPreviousDivisionBeat(0.99)).toBe(0.75);
});

test('getNextDivisionBeat returns correct value', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 4;

    expect(model.getNextDivisionBeat(1.27)).toBe(1.5);
    expect(model.getNextDivisionBeat(3.09)).toBe(3.25);
    expect(model.getNextDivisionBeat(0.99)).toBe(1);
});

test('getSnappedBeat returns input value if zero snapStrength', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 1;
    model.snapStrength = 0;

    expect(model.getSnappedBeat(0)).toBe(0);
    expect(model.getSnappedBeat(0.01)).toBe(0.01);
    expect(model.getSnappedBeat(0.99)).toBe(0.99);
    expect(model.getSnappedBeat(1)).toBe(1);
});

test('getSnappedBeat can snap with 1% strength', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 1;
    model.snapStrength = 0.01;

    expect(model.getSnappedBeat(0.01)).toBe(0);
    expect(model.getSnappedBeat(0.02)).toBe(0.02);
    expect(model.getSnappedBeat(0.98)).toBe(0.98);
    expect(model.getSnappedBeat(0.99001)).toBe(1);
});

test('getSnappedBeat can snap with 10% strength', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 1;
    model.snapStrength = 0.1;

    expect(model.getSnappedBeat(0.1)).toBe(0);
    expect(model.getSnappedBeat(0.11)).toBe(0.11);
    expect(model.getSnappedBeat(0.89)).toBe(0.89);
    expect(model.getSnappedBeat(0.9)).toBe(1);
});

test('getSnappedBeat can snap with 50% strength', () => {
    const model = new ClipEditorViewModel();
    model.divisionsPerBeat = 1;
    model.snapStrength = 0.5;

    expect(model.getSnappedBeat(0.4999)).toBe(0);
    expect(model.getSnappedBeat(0.5)).toBe(1);
});

test('set totalWidth updates xZoom', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(4);
    
    model.totalWidth = 100;

    expect(model.beatWidth).toBe(25);
    expect(model.xZoom).toBe(0.25);
});

test('set totalHeight updates yZoom', () => {
    const model = new ClipEditorViewModel();
    model.clip = new Clip(4);

    model.totalHeight = 640;
    
    expect(model.pitchHeight).toBe(5);
    expect(model.yZoom).toBe(0.25);
});