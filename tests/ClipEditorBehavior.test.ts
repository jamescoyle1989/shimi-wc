import { expect, test } from 'vitest';
import { ClipEditorBehavior, dragModes } from '../src/ClipEditorBehavior';
import { ClipEditorViewModel } from '../src/ClipEditorViewModel';
import { Clip } from 'shimi';

class ClipEditorMock {
    updatesRequested: number = 0;
    
    requestUpdate() {
        this.updatesRequested++;
    }
}

//Simple default setup for tests, create a vm containing a clip with 3 notes
//Return the behavior, vm & editor objects
function getDefaultTestSetup(): [ClipEditorBehavior, ClipEditorViewModel, ClipEditorMock] {
    const vm = new ClipEditorViewModel();
    vm.clip = new Clip(4)
        .addNote([0,1,2], 0.5, 60, 80);

    const mock = new ClipEditorMock();
    
    return [
        new ClipEditorBehavior(mock as any, vm),
        vm,
        mock
    ];
}

test('Middle click on existing note removes it', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    expect(vm.clip?.notes.length).toBe(3);

    behavior.onMouseDown({
        x: vm.getXFromBeat(0.25),
        y: vm.getYFromPitch(60)
    }, 1);

    expect(vm.clip?.notes.length).toBe(2);
    expect(editor.updatesRequested).toBe(1);
});

test('Left click on no note starts adding one', () => {
    const [behavior, vm] = getDefaultTestSetup();

    behavior.onMouseDown({
        x: vm.getXFromBeat(0.7),
        y: vm.getYFromPitch(72)
    }, 0);

    expect(vm.clip?.notes.length).toBe(4);
    expect(vm.selectedNote?.pitch).toBe(72);
    expect(vm.selectedNote?.start).toBe(0.5);
    expect(vm.selectedNote?.duration).toBe(0.5);
    expect(behavior['_dragMode']).toBe(dragModes.noteCreation);
});

test('Left click on existing note starts dragging it', () => {
    const [behavior, vm] = getDefaultTestSetup();

    behavior.onMouseDown({
        x: vm.getXFromBeat(0.3),
        y: vm.getYFromPitch(60)
    }, 0);

    expect(vm.clip?.notes.length).toBe(3);
    expect(vm.selectedNote?.pitch).toBe(60);
    expect(vm.selectedNote?.start).toBe(0);
    expect(behavior['_dragMode']).toBe(dragModes.noteStart + dragModes.noteEnd + dragModes.pitch);
});

test('Double click on existing note removes it', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    expect(vm.clip?.notes.length).toBe(3);

    behavior.onDoubleClick({
        x: vm.getXFromBeat(0.25),
        y: vm.getYFromPitch(60)
    });

    expect(vm.clip?.notes.length).toBe(2);
    expect(editor.updatesRequested).toBe(1);
});

test('Drag whole note moves selected note start to new position', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.noteStart + dragModes.noteEnd;
    behavior['_dragOffset'] = 0.2;

    behavior.onMouseMove({
        x: vm.getXFromBeat(0.7),
        y: vm.getYFromPitch(72)
    });

    expect(vm.selectedNote?.start).toBe(0.5);
    expect(vm.selectedNote?.pitch).toBe(60);
    expect(vm.selectedNote?.duration).toBe(0.5);
    expect(editor.updatesRequested).toBe(1);
});

test('Drag just note start adjusts note start & duration', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.noteStart;
    behavior['_dragOffset'] = 0.1;

    behavior.onMouseMove({
        x: vm.getXFromBeat(0.4),
        y: vm.getYFromPitch(72)
    });

    expect(vm.selectedNote?.start).toBeCloseTo(0.3);
    expect(vm.selectedNote?.pitch).toBe(60);
    expect(vm.selectedNote?.duration).toBeCloseTo(0.2);
    expect(editor.updatesRequested).toBe(1);
});

test('Drag just note end adjusts note end & duration', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.noteEnd;
    behavior['_dragOffset'] = -0.1;

    behavior.onMouseMove({
        x: vm.getXFromBeat(0.9),
        y: vm.getYFromPitch(72)
    });

    expect(vm.selectedNote?.start).toBe(0);
    expect(vm.selectedNote?.pitch).toBe(60);
    expect(vm.selectedNote?.duration).toBe(1);
    expect(editor.updatesRequested).toBe(1);
});

test('Drag note creation snaps note to next full division', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.noteCreation;
    behavior['_dragOffset'] = 0.1;

    behavior.onMouseMove({
        x: vm.getXFromBeat(1.2),
        y: vm.getYFromPitch(72)
    });

    expect(vm.selectedNote?.start).toBe(0);
    expect(vm.selectedNote?.pitch).toBe(60);
    expect(vm.selectedNote?.duration).toBe(1.5);
    expect(editor.updatesRequested).toBe(1);
});

test('Drag note pitch moves note to current pitch', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.pitch;

    behavior.onMouseMove({
        x: vm.getXFromBeat(1.2),
        y: vm.getYFromPitch(72)
    });

    expect(vm.selectedNote?.start).toBe(0);
    expect(vm.selectedNote?.pitch).toBe(72);
    expect(vm.selectedNote?.duration).toBe(0.5);
    expect(editor.updatesRequested).toBe(1);
});

test('On mouse up all dragging is stopped', () => {
    const [behavior, vm, editor] = getDefaultTestSetup();
    vm.selectedNote = vm.clip?.notes[0] ?? null;
    behavior['_dragMode'] = dragModes.noteEnd;

    behavior.onMouseUp({x: 0, y: 0}, 0);

    expect(vm.selectedNote).toBeNull();
    expect(behavior['_dragMode']).toBe(dragModes.none);
    expect(editor.updatesRequested).toBe(1);
});