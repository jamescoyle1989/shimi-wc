import type { Meta, StoryObj } from '@storybook/web-components';
import { ChordProgressionEditor } from '../chord-progression-editor';
import { Chord, ChordFinder, ChordProgression, ChordProgressionPlayer, Clock, Metronome, MidiBus, ScaleTemplate } from 'shimi';


const meta: Meta<ChordProgressionEditor> = {
    title: 'ChordProgressionEditor',
    tags: ['autodocs'],
    render: (args: any) => {
        const output = new ChordProgressionEditor();
        for (const prop in args)
            (output as any)[prop] = args[prop];
        return output;
    },
    argTypes: {
        chordProgression: {
            control: 'none',
            description: 'The shimi.ChordProgression object which the ChordProgressionEditor will display and enable editing of.'
        },
        xZoom: {
            control: { type: 'number', min: 0.5, max: 2, step: 0.1 },
            description: 'Multiplier to be used when rendering x-coordinates in the component.'
        },
        yZoom: {
            control: { type: 'number', min: 0.5, max: 2, step: 0.1 },
            description: 'Multiplier to be used when rendering y-coordinates in the component.'
        },
        width: {
            control: { type: 'number', min: 100, max: 1000, step: 10 },
            description: 'Controls the total width of the component.'
        },
        height: {
            control: { type: 'number', min: 100, max: 1000, step: 10 },
            description: 'Controls the total height of the component.'
        },
        beatsPerBar: {
            control: { type: 'number', min: 1, max: 8, step: 1 },
            description: 'How many beat lines to render before a bar line occurs'
        },
        divisionsPerBeat: {
            control: { type: 'number', min: 1, max: 8, step: 1 },
            description: 'How many subdivisions to render per beat. These provide a useful visual cue where each beat divides, as well as note snapping.'
        },
        maxBeatsPerLine: {
            control: { type: 'number', min: -1, max: 16, step: 1 },
            description: 'How many beats can fit onto a single line before wrapping around to a new one.'
        },
        snapStrength: {
            control: { type: 'number', min: 0, max: 1, step: 0.01 },
            description: 'How strongly note starts & ends will snap to beat divisions. Default value = 0.05, meaning that given the distance from one beat division to the next, a note start or end must be within 5% of that distance from the division to snap to it.'
        },
        scale: {
            control: 'none',
            description: 'The scale object to use when looking up relative chord names.'
        },
        chordColor: {
            control: 'none',
            description: 'Function that takes a ChordProgressionChord and boolean of whether it\'s valid. Returns color as string.'
        }
    }
};
export default meta;

const scale = ScaleTemplate.major.create('C');
const chordFinder = new ChordFinder().withDefaultChordLookups();
Chord.nameGenerator = chord => {
    const result = chordFinder.findChord(chord.pitches, chord.root, null, scale);
    if (result == null)
        return null;
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


type Story = StoryObj<ChordProgressionEditor>;

export const Primary: Story = {
    args: {
        chordProgression: oneFiveSixFour()
    }
};

export const SplitOverMultipleLines: Story = {
    args: {
        chordProgression: oneFiveSixFour(),
        maxBeatsPerLine: 8
    }
};

export const Playhead: Story = {
    args: {
        chordProgression: oneFiveSixFour(),
        maxBeatsPerLine: 8
    },
    play: async({ canvasElement }) => {
        const editor = canvasElement.children.item(0) as ChordProgressionEditor;
        const clock = new Clock();
        const metronome = clock.addChild(new Metronome(120)) as Metronome;
        const player = clock.addChild(new ChordProgressionPlayer(editor.chordProgression, metronome)) as ChordProgressionPlayer;
        clock.addChild(editor.addPlayhead(player));
        clock.start();
    }
}

export const MultipleColors: Story = {
    args: {
        chordProgression: oneFiveSixFour(),
        xZoom: 0.5,
        chordColor: (chord, isValid) => {
            if (!isValid)
                return '#FF888888';
            if (chord.start < 4)
                return '#FFFF8888';
            if (chord.start < 8)
                return '#88FF8888';
            if (chord.start < 12)
                return '#88FFFF88';
            return '#8888FF88';
        }
    }
}