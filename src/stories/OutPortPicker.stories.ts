import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { OutPortPicker } from '../out-port-picker';
import { newMockMidiAccess } from './Mocks';


const meta: Meta<typeof OutPortPicker> = {
    title: 'OutPortPicker',
    tags: ['autodocs'],
    render: (args: any) => {
        const output = new OutPortPicker();
        for (const prop in args)
            (output as any)[prop] = args[prop];
        return output;
    },
    argTypes: {
        midiAccess: {
            control: 'none',
            description: 'Holds a reference to a shimi.MidiAccess object, used to fetch MIDI-Out ports that can be connected to. This also enables the control to listen for newly added/removed ports and update itself accordingly. This property must be set for the component to be in any way useful.'
        },
        port: {
            control: {
                type: 'text'
            },
            description: 'The name of the selected port. If this is set to a value which doesn\'t correspond to an available port name, then the component will simply show no port selected. This property will be updated when the user selects new dropdown values, as well as a port-change event being fired.'
        },
        midiOut: {
            control: 'none',
            description: 'Holds a reference to a shimi.MidiOut object, which gets updated with the selected port when changed. This is optional to set, and is really provided just as a convenience over listening for the port-change event to update the MidiOut.'
        }
    },
    parameters: {
        actions: {
            handles: ['port-change']
        }
    },
    decorators: [withActions]
};
export default meta;


type Story = StoryObj<OutPortPicker>;

export const Primary: Story = {
    args: {
        midiAccess: newMockMidiAccess()
    }
};

export const PortPresetToValidName: Story = {
    args: {
        midiAccess: newMockMidiAccess(),
        port: 'Out Port 2'
    }
};

export const PortPresetToInvalidName: Story = {
    args: {
        midiAccess: newMockMidiAccess(),
        port: 'Made Up Port'
    }
};

export const AdditionalPortAdded: Story = {
    args: {
        midiAccess: newMockMidiAccess()
    },
    play: async({ canvasElement }) => {
        const outPicker = canvasElement.children.item(0) as OutPortPicker;
        (outPicker.midiAccess as any).mockAddOutPort('Out Port 3')
    }
};