import { ClipNote } from 'shimi';
import { ClipEditorViewModel } from './ClipEditorViewModel';
import { ClipEditor } from './clip-editor';


const dragModes = {
    none: 0,
    wholeNote: 1,
    noteEnd: 2,
    noteStart: 3,
    noteCreation: 4
}

export class ClipEditorBehavior {
    private _clipEditor: ClipEditor;

    private _viewModel: ClipEditorViewModel;

    private _dragMode: number = dragModes.none;

    private _dragOffset: number = 0;

    constructor(clipEditor: ClipEditor, viewModel: ClipEditorViewModel) {
        this._clipEditor = clipEditor;
        this._viewModel = viewModel;
    }



    onMouseDown(cartesian: {x: number, y: number}, button: number): void {
        const vm = this._viewModel;
        if (!vm.clip)
            return;
        const beat = vm.getBeatFromX(cartesian.x);
        const pitch = vm.getPitchFromY(cartesian.y);
        const existingNote = vm.getNoteAt(beat, pitch);
        if (button == 1 && !!existingNote)
            this._removeNote(existingNote);
        else if (button == 0) {
            //Add/edit note
            if (!existingNote)
                this._addNewNote(beat, pitch);
            else
                this._beginNoteDrag(existingNote, beat);
        }
    }

    onMouseMove(cartesian: {x: number, y: number}): void {
        const vm = this._viewModel;
        if (!vm.selectedNote || this._dragMode == dragModes.none)
            return;

        const newDragBeat = vm.getSnappedBeat(vm.getBeatFromX(cartesian.x) - this._dragOffset);
        if (this._dragMode == dragModes.wholeNote) {
            vm.selectedNote.start = newDragBeat;
            vm.selectedNote.pitch = vm.getPitchFromY(cartesian.y);
        }
        else if (this._dragMode == dragModes.noteStart) {
            if (newDragBeat < vm.selectedNote.end) {
                const noteEnd = vm.selectedNote.end;
                vm.selectedNote.start = newDragBeat;
                vm.selectedNote.end = noteEnd;
            }
        }
        else if (this._dragMode == dragModes.noteEnd) {
            if (newDragBeat > vm.selectedNote.start)
                vm.selectedNote.end = newDragBeat;
        }
        else if (this._dragMode == dragModes.noteCreation) {
            const newNoteEnd = vm.getNextDivisionBeat(vm.getBeatFromX(cartesian.x));
            if (newNoteEnd > vm.selectedNote.start)
                vm.selectedNote.end = newNoteEnd;
        }
        this._clipEditor.requestUpdate();
    }

    onMouseUp(cartesian: {x: number, y: number}, button: number): void {
        const vm = this._viewModel;
        if (button == 0) {
            this._dragMode = dragModes.none;
            if (!!vm.clip && !!vm.selectedNote && vm.selectedNote.duration <= 0)
                vm.clip.notes = vm.clip.notes.filter(n => n !== vm.selectedNote);
            vm.selectedNote = null;
            this._clipEditor.requestUpdate();
        }
    }

    onMouseLeave(cartesian: {x: number, y: number}, button: number): void {
        const vm = this._viewModel;
        this._dragMode = dragModes.none;
        if (!!vm.clip && !!vm.selectedNote && vm.selectedNote.duration <= 0)
            vm.clip.notes = vm.clip.notes.filter(n => n !== vm.selectedNote);
        vm.selectedNote = null;
        this._clipEditor.requestUpdate();
    }



    private _addNewNote(beat: number, pitch: number): void {
        const vm = this._viewModel;
        const newNote = new ClipNote(
            vm.getPreviousDivisionBeat(beat),
            vm.beatsPerDivision,
            pitch,
            80
        );
        vm.clip?.notes.push(newNote);
        vm.selectedNote = newNote;
        this._dragMode = dragModes.noteCreation;
        this._clipEditor.requestUpdate();
    }

    private _removeNote(note: ClipNote): void {
        const vm = this._viewModel;
        if (!vm.clip)
            return;
        vm.clip.notes = vm.clip.notes.filter(n => n !== note);
        vm.selectedNote = null;
        this._dragMode = dragModes.none;
        this._clipEditor.requestUpdate();
    }

    private _beginNoteDrag(note: ClipNote, beat: number): void {
        const vm = this._viewModel;
        if (!vm.clip)
            return;
        const grabPercent = note.getPercent(beat);
        if (grabPercent <= vm.noteGrabEndsPercent)
            this._dragMode = dragModes.noteStart;
        else if (grabPercent >= 1 - vm.noteGrabEndsPercent)
            this._dragMode = dragModes.noteEnd;
        else
            this._dragMode = dragModes.wholeNote;

        if (this._dragMode == dragModes.noteEnd)
            this._dragOffset = beat - note.end;
        else
            this._dragOffset = beat - note.start;
        vm.selectedNote = note;
        this._clipEditor.requestUpdate();
    }
}