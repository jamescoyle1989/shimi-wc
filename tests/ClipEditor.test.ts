import { expect, test } from 'vitest';
import { ClipEditor } from '../src/clip-editor';
import { Clip, ClipPlayer, Clock, Metronome, MidiBus, TimeSig } from 'shimi';


test('addClipPlayer returns new ClipEditorPlayhead', () => {
    const editor = new ClipEditor();
    const clip = new Clip(4);
    editor.clip = clip;
    const clock = new Clock();
    const metronome = new Metronome(120, TimeSig.commonTime());
    const midiOut = new MidiBus();
    const clipPlayer = new ClipPlayer(clip, metronome, midiOut);

    const playhead = editor.addPlayhead(clipPlayer);
});

test('addClipPlayer throws error if player is for different clip', () => {
    const editor = new ClipEditor();
    const clip1 = new Clip(4);
    const clip2 = new Clip(4);
    editor.clip = clip1;
    const clock = new Clock();
    const metronome = new Metronome(120, TimeSig.commonTime());
    const midiOut = new MidiBus();
    const clipPlayer = new ClipPlayer(clip2, metronome, midiOut);

    expect(() => editor.addPlayhead(clipPlayer)).toThrowError();
});