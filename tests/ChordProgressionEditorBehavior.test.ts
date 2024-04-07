import { expect, test } from 'vitest';
import { ChordProgressionEditorViewModel } from '../src/ChordProgressionEditorViewModel';
import { ChordProgressionEditorBehavior } from '../src/ChordProgressionEditorBehavior';
import { Chord, ChordFinder, ChordProgression, ScaleTemplate } from 'shimi';
import { dragModes } from '../src/ClipEditorBehavior';

class ChordProgressionEditorMock {
    updatesRequested: number = 0;

    requestUpdate() {
        this.updatesRequested++;
    }
}

const scale = ScaleTemplate.major.create('C');
const chordFinder = new ChordFinder().withDefaultChordLookups();
Chord.nameGenerator = chord => {
    const result = chordFinder.findChord(chord.pitches, chord.root, undefined, scale);
    if (result == null)
        return '';
    return result.name
        .replace('{r}', scale.getPitchName(result.root))
        .replace('{r}', scale.getPitchName(result.bass));
};

function oneFiveSixFour(): ChordProgression {
    const output = new ChordProgression(16)
        .addChord(0, 4, chordFinder.newChord('C'))
        .addChord(4, 4, chordFinder.newChord('G'))
        .addChord(8, 4, chordFinder.newChord('Am'))
        .addChord(12, 4, chordFinder.newChord('F'));
    return output;
}

//Simple default setup for tests, create a vm containing a clip with 3 notes
//Return the behavior, vm & editor objects
function getDefaultTestSetup(): [ChordProgressionEditorBehavior, ChordProgressionEditorViewModel, ChordProgressionEditorMock] {
    const vm = new ChordProgressionEditorViewModel();
    vm.chordProgression = oneFiveSixFour();

    const mock = new ChordProgressionEditorMock();
    
    return [
        new ChordProgressionEditorBehavior(mock as any, vm),
        vm,
        mock
    ];
}

test('Can start drag on the end of a chord on the 2nd line', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.maxBeatsPerLine = 8;
    const clickBeat = 11.9;
    const clickX = vm.getXFromBeat(clickBeat);
    const clickY = vm.getYFromBeat(clickBeat);

    behavior.onMouseDown({x: clickX, y: clickY}, 1);

    expect(behavior['_dragMode']).toBe(dragModes.noteEnd);
    expect(behavior['_draggedChord']).toBe(vm.chordProgression.getChordAt(10));
    expect(behavior['_draggedNeighbourChord']).toBe(vm.chordProgression.getChordAt(14));
});