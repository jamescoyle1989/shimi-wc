import type { Meta, StoryObj } from '@storybook/web-components';
import { ClipEditor } from '../clip-editor';
import { Clip, ClipPlayer, Clock, Metronome, MidiBus, ScaleTemplate } from 'shimi';
import { DefaultClipEditorFullWidthStrategy } from '../ClipEditorFullWidthStrategies';


const meta: Meta<ClipEditor> = {
    title: 'ClipEditor',
    tags: ['autodocs'],
    render: (args: any) => {
        const output = new ClipEditor();
        for (const prop in args)
            (output as any)[prop] = args[prop];
        return output;
    },
    argTypes: {
        clip: {
            control: 'none',
            description: 'The shimi.Clip object which the ClipEditor will display and enable editing of.'
        },
        minPitch: {
            control: { type: 'number', min: 0, max: 127, step: 1 },
            description: 'The minimum pitch in the piano roll which the ClipEditor will render.'
        },
        maxPitch: {
            control: { type: 'number', min: 0, max: 127, step: 1 },
            description: 'The maximum pitch in the piano roll which the ClipEditor will render.'
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
        snapStrength: {
            control: { type: 'number', min: 0, max: 1, step: 0.01 },
            description: 'How strongly note starts & ends will snap to beat divisions. Default value = 0.05, meaning that given the distance from one beat division to the next, a note start or end must be within 5% of that distance from the division to snap to it.'
        },
        noteResizeHandleArea: {
            control: { type: 'number', min: 0, max: 1, step: 0.01 },
            description: 'How much of the note\'s area can be grabbed to resize it, rather than to move it. The default value = 0.2, meaning if you grab the left-most 20% of a note, you be resizing it from its start. Alternatively if you grab the right-most 20% of a note, you\'d be resizing it from its end.'
        },
        scale: {
            control: 'none',
            description: 'The scale object to use when getting pitch names.'
        },
        filterPitchesByScale: {
            control: 'boolean',
            description: 'If true, then only pitches which belong to the currently set scale will be rendered. Other pitches, as well as any notes on those pitches, won\'t be rendered.'
        },
        customPitchNames: {
            control: 'none',
            description: 'A Map<number, string> object that maps pitch numbers to pitch names'
        },
        noteColor: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object & boolean flag representing whether that note is selected, and returns a string color value.'
        },
        canAddNote: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object, and returns true if that note would be allowed to be added. If you want to add custom modifications to notes added through the UI, this can also be a good place to do so.'
        },
        canEditNoteStart: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object, and returns true if the start of the note would be allowed to be altered.'
        },
        canEditNoteEnd: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object, and returns true if the end of the note would be allowed to be altered.'
        },
        canEditNotePitch: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object, and returns true if the pitch of the note would be allowed to be altered.'
        },
        canDeleteNote: {
            control: 'none',
            description: 'Function that takes in a shimi.ClipNote object, and returns true if the note would be allowed to be removed from the clip.'
        }
    }
};
export default meta;


function twinkleTwinkle(): Clip {
    return new Clip(8)
        .addNote([0, 1], 1, 'C4', 80)
        .addNote([2, 3], 1, 'G4', 80)
        .addNote([4, 5], 1, 'A4', 80)
        .addNote([6, 7], 1, 'G4', 80);
}

function multiChannelClip(): Clip {
    return new Clip(8)
        .addNote(0, 0.5, 'C4', 80, 0)
        .addNote(0.5, 0.5, 'D4', 80, 1)
        .addNote(1, 0.5, 'E4', 80, 2)
        .addNote(1.5, 0.5, 'F4', 80, 3)
        .addNote(2, 0.5, 'G4', 80, 4)
        .addNote(2.5, 0.5, 'A4', 80, 5)
        .addNote(3, 0.5, 'B4', 80, 6)
        .addNote(3.5, 0.5, 'C5', 80, 7)
        .addNote(4, 0.5, 'B4', 80, 8)
        .addNote(4.5, 0.5, 'A4', 80, 9)
        .addNote(5, 0.5, 'G4', 80, 10)
        .addNote(5.5, 0.5, 'F4', 80, 11)
        .addNote(6, 0.5, 'E4', 80, 12)
        .addNote(6.5, 0.5, 'D4', 80, 13)
        .addNote(7, 1, 'C4', 80, 14);
}


type Story = StoryObj<ClipEditor>;

export const Primary: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 55,
        maxPitch: 79
    }
};

export const NoClip: Story = {
    args: {
    }
};

export const XAndYZoom: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        xZoom: 0.6,
        yZoom: 1.5
    }
};

export const WidthAndHeight: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        width: 500,
        height: 500
    }
};

export const BeatsPerBarAndDivisionsPerBeat: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        beatsPerBar: 3,
        divisionsPerBeat: 5
    }
};

export const HighSnapStrength: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        snapStrength: 0.5
    }
};

export const NoNoteResizeHandleArea: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        noteResizeHandleArea: 0
    }
};

export const WithScaleSet: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 55,
        maxPitch: 79,
        scale: ScaleTemplate.major.create('Gb')
    }
};

export const FilterPitchesByScale: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 55,
        maxPitch: 79,
        scale: ScaleTemplate.major.create('G'),
        filterPitchesByScale: true
    }
};

export const CustomPitchNaming: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 24,
        maxPitch: 35,
        customPitchNames: new Map<number, string>()
            .set(24, 'A').set(25, 'B').set(26, 'C')
            .set(27, 'D').set(28, 'E').set(29, 'F')
            .set(30, 'G').set(31, 'H').set(32, 'I')
            .set(33, 'J').set(34, 'K').set(35, 'L')
    }
};

export const DefaultNoteColoring: Story = {
    args: {
        clip: multiChannelClip(),
        minPitch: 60,
        maxPitch: 72
    }
};

export const CanOnlyAddNotesBelowG4: Story = {
    args: {
        clip: new Clip(8),
        minPitch: 60,
        maxPitch: 72,
        canAddNote: n => n.pitch < 67
    }
};

export const CanOnlyEditNoteStartBeforeBeat4: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        canEditNoteStart: n => n.start < 4
    }
};

export const CanOnlyEditNoteEndAboveF4: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        canEditNoteEnd: n => n.pitch > 65
    }
};

export const CanOnlyEditNotePitchBeforeBeat4: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        canEditNotePitch: n => n.start < 4
    }
};

export const CantDeleteNotes: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        canDeleteNote: n => false
    }
};

export const Playhead: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72
    },
    play: async({ canvasElement }) => {
        const editor = canvasElement.children.item(0) as ClipEditor;
        const clock = new Clock();
        const metronome = clock.addChild(new Metronome(120)) as Metronome;
        const midiOut = new MidiBus();
        const clipPlayer = clock.addChild(new ClipPlayer(editor.clip, metronome, midiOut)) as ClipPlayer;
        clipPlayer.beatCount = editor.clip.duration;
        clock.addChild(editor.addPlayhead(clipPlayer));
        clock.start();
    }
}

export const FullWidth: Story = {
    args: {
        clip: twinkleTwinkle(),
        minPitch: 60,
        maxPitch: 72,
        canDeleteNote: n => false,
        fullWidthStrategy: new DefaultClipEditorFullWidthStrategy()
    }
}