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
}