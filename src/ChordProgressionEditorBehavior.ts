import { ChordProgressionEditorViewModel } from './ChordProgressionEditorViewModel';
import { ChordProgressionEditor } from './chord-progression-editor';

export class ChordProgressionEditorBehavior {
    private _chordProgressionEditor: ChordProgressionEditor;
    
    private _viewModel: ChordProgressionEditorViewModel;

    constructor(
        chordProgressionEditor: ChordProgressionEditor,
        viewModel: ChordProgressionEditorViewModel
    ) {
        this._chordProgressionEditor = chordProgressionEditor;
        this._viewModel = viewModel;
    }



    onDoubleClick(cartesian: {x: number, y: number}): void {
        const vm = this._viewModel;
        const snappedBeat = vm.getSnappedBeat(vm.getBeatFromX(cartesian.x));
        const chordAtBeat = vm.chordProgression.chords.find(x => x.start == snappedBeat);

        if (!!chordAtBeat) {
            const previousChord = vm.chordProgression.chords
                .filter(x => x.start < snappedBeat)
                .sort((a, b) => b.start - a.start)
                .find(x => true);
            if (!!previousChord) {
                vm.chordProgression.removeChords(x => x === chordAtBeat);
                previousChord.end = chordAtBeat.end;
            }
        }
        else {
            const currentChord = vm.chordProgression.getChordAt(snappedBeat);
            vm.chordProgression.addChord(
                snappedBeat,
                currentChord.end - snappedBeat,
                currentChord.chord.duplicate()
            );
            currentChord.end = snappedBeat;
        }
        this._chordProgressionEditor.requestUpdate();
    }
}