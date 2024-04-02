import { ChordProgressionChord } from 'shimi';
import { ChordProgressionEditorViewModel } from './ChordProgressionEditorViewModel';
import { ChordProgressionEditor } from './chord-progression-editor';
import { dragModes } from './ClipEditorBehavior';

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



    onMouseDown(cartesian: {x: number, y: number}, button: number): void {
        const vm = this._viewModel;
        if (!vm.chordProgression)
            return;
        const beat = vm.getBeatFromXY(cartesian);
        const existingChord = vm.chordProgression.getChordAt(beat);
        if (!existingChord)
            return;
        this._beginChordDrag(existingChord, beat);
    }

    onMouseMove(cartesian: {x: number, y: number}): void {
        const vm = this._viewModel;
        if (!vm.chordProgression || this._dragMode == dragModes.none || !this._draggedChord)
            return;

        const dragChordStart = (this._dragMode & dragModes.noteStart) > 0;
        const dragChordEnd = (this._dragMode & dragModes.noteEnd) > 0;

        let newDragBeat = vm.getSnappedBeat(vm.getBeatFromXY(cartesian) - this._dragOffset);
        if (dragChordStart) {
            if (newDragBeat < this._draggedChord.end) {
                const minDragBeat = vm.chordProgression.chords
                    .filter(x => x !== this._draggedChord && x !== this._draggedNeighbourChord && x.start < this._draggedChord.start)
                    .sort((a, b) => b.end - a.end)[0]?.end ?? 0;
                newDragBeat = Math.max(newDragBeat, minDragBeat);

                const chordEnd = this._draggedChord.end;
                this._draggedChord.start = newDragBeat;
                this._draggedChord.end = chordEnd;
                if (!!this._draggedNeighbourChord)
                    this._draggedNeighbourChord.end = newDragBeat;
            }
        }
        else if (dragChordEnd) {
            if (newDragBeat > this._draggedChord.start) {
                const maxDragBeat = vm.chordProgression.chords
                    .filter(x => x !== this._draggedChord && x !== this._draggedNeighbourChord && x.start > this._draggedChord.start)
                    .sort((a, b) => a.end - b.end)[0].start ?? vm.chordProgression.end;
                newDragBeat = Math.min(newDragBeat, maxDragBeat);

                this._draggedChord.end = newDragBeat;
                if (!!this._draggedNeighbourChord) {
                    const neighbourEnd = this._draggedNeighbourChord.end;
                    this._draggedNeighbourChord.start = newDragBeat;
                    this._draggedNeighbourChord.end = neighbourEnd;
                }
            }
        }

        this._chordProgressionEditor.requestUpdate();
    }

    onMouseUp(cartesian: {x: number, y: number}, button: number): void {
        const vm = this._viewModel;
        if (button == 0) {
            this._dragMode = dragModes.none;
            if (!!vm.chordProgression && !!this._draggedChord && this._draggedChord.duration <= 0)
                vm.chordProgression.chords = vm.chordProgression.chords.filter(c => c !== this._draggedChord);
            this._draggedChord = null;
            this._chordProgressionEditor.requestUpdate();
        }
    }

    onMouseLeave(cartesian: {x: number, y: number}, button: number): void {
        this.onMouseUp(cartesian, 0);
    }

    onDoubleClick(cartesian: {x: number, y: number}): void {
        const vm = this._viewModel;
        const snappedBeat = vm.getSnappedBeat(vm.getBeatFromXY(cartesian));
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


    private _draggedChord: ChordProgressionChord = null;
    private _draggedNeighbourChord: ChordProgressionChord = null;
    private _dragOffset: number = 0;
    private _dragMode: number = dragModes.none;

    private _beginChordDrag(chord: ChordProgressionChord, beat: number) {
        const vm = this._viewModel;
        if (!vm.chordProgression)
            return;
        const grabPercent = chord.getPercent(beat);
        let neighbour: ChordProgressionChord = null;

        if (grabPercent <= vm.chordResizeHandleArea) {
            this._dragMode = dragModes.noteStart;
            neighbour = vm.chordProgression.chords.find(x => x.end == chord.start);
        }
        else if (grabPercent >= 1 - vm.chordResizeHandleArea) {
            this._dragMode = dragModes.noteEnd;
            neighbour = vm.chordProgression.chords.find(x => x.start == chord.end);
        }

        if (this._dragMode == dragModes.none)
            return;

        if (this._dragMode == dragModes.noteEnd)
            this._dragOffset = beat - chord.end;
        else
            this._dragOffset = beat - chord.start;
        this._draggedChord = chord;
        this._draggedNeighbourChord = neighbour;
        this._chordProgressionEditor.requestUpdate();
    }
}