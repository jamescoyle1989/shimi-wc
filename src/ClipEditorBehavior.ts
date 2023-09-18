import { ClipNote } from 'shimi';
import { ClipEditorViewModel } from './ClipEditorViewModel';
import { ClipEditor } from './clip-editor';


export const dragModes = {
    none: 0,
    noteCreation: 1,
    noteStart: 2,
    noteEnd: 4,
    pitch: 8
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

    onDoubleClick(cartesian: {x: number, y: number}): void {
        this.onMouseDown(cartesian, 1);
    }

    onMouseMove(cartesian: {x: number, y: number}): void {
        const vm = this._viewModel;
        if (!vm.selectedNote || this._dragMode == dragModes.none)
            return;

        const dragNoteCreation = (this._dragMode & dragModes.noteCreation) > 0;
        const dragNoteStart = (this._dragMode & dragModes.noteStart) > 0;
        const dragNoteEnd = (this._dragMode & dragModes.noteEnd) > 0;
        const dragNotePitch = (this._dragMode & dragModes.pitch) > 0;

        const newDragBeat = vm.getSnappedBeat(vm.getBeatFromX(cartesian.x) - this._dragOffset);
        if (dragNoteStart && dragNoteEnd) {
            vm.selectedNote.start = newDragBeat;
        }
        else if (dragNoteStart) {
            if (newDragBeat < vm.selectedNote.end) {
                const noteEnd = vm.selectedNote.end;
                vm.selectedNote.start = newDragBeat;
                vm.selectedNote.end = noteEnd;
            }
        }
        else if (dragNoteEnd) {
            if (newDragBeat > vm.selectedNote.start)
                vm.selectedNote.end = newDragBeat;
        }
        else if (dragNoteCreation) {
            const newNoteEnd = vm.getNextDivisionBeat(vm.getBeatFromX(cartesian.x));
            if (newNoteEnd > vm.selectedNote.start)
                vm.selectedNote.end = newNoteEnd;
        }
        
        if (dragNotePitch) {
            vm.selectedNote.pitch = vm.getPitchFromY(cartesian.y);
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
        this.onMouseUp(cartesian, 0);
    }



    private _addNewNote(beat: number, pitch: number): void {
        const vm = this._viewModel;
        const newNote = new ClipNote(
            vm.getPreviousDivisionBeat(beat),
            vm.beatsPerDivision,
            pitch,
            80
        );
        if (!vm.canAddNote(newNote))
            return;
        vm.clip?.notes.push(newNote);
        vm.selectedNote = newNote;
        this._dragMode = dragModes.noteCreation;
        this._clipEditor.requestUpdate();
    }

    private _removeNote(note: ClipNote): void {
        const vm = this._viewModel;
        if (!vm.clip)
            return;
        if (!vm.canDeleteNote(note))
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

        if (vm.canEditNotePitch(note)) {
            this._dragMode = dragModes.pitch;
        }
        if (grabPercent <= vm.noteResizeHandleArea) {
            if (vm.canEditNoteStart(note))
                this._dragMode = dragModes.noteStart;
        }
        else if (grabPercent >= 1 - vm.noteResizeHandleArea) {
            if (vm.canEditNoteEnd(note))
                this._dragMode = dragModes.noteEnd;
        }
        else if (vm.canEditNoteStart(note) && vm.canEditNoteEnd(note)) {
            this._dragMode += dragModes.noteStart + dragModes.noteEnd;
        }

        if (this._dragMode == dragModes.noteEnd)
            this._dragOffset = beat - note.end;
        else
            this._dragOffset = beat - note.start;
        vm.selectedNote = note;
        this._clipEditor.requestUpdate();
    }
}