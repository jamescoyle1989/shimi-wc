import { ChordProgressionChord } from 'shimi';
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


    onChordNameChanged(chord: ChordProgressionChord, newName: string): void {
        const vm = this._viewModel;

        if (newName == '') {
            vm.chordsIncorrectlyModified.delete(chord);
            vm.chordProgression.removeChords(x => x === chord);
            this._chordProgressionEditor.requestUpdate();
            return;
        }

        const newChord = vm.chordFinder.newChord(newName);
        if (!!newChord) {
            chord.chord = newChord;
            vm.chordsIncorrectlyModified.delete(chord);
        }
        else {
            vm.chordsIncorrectlyModified.add(chord);
        }
        this._chordProgressionEditor.requestUpdate();
    }


    onChordAdded(chord: ChordProgressionChord): void {
        const vm = this._viewModel;

        vm.chordProgression.addChord(chord.start, chord.duration, chord.chord);
        this._chordProgressionEditor.requestUpdate();
    }
}