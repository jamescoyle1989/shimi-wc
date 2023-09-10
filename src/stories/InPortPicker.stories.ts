import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { InPortPicker } from '../in-port-picker';
import { newMockMidiAccess } from './Mocks';


const meta: Meta<typeof InPortPicker> = {
    title: 'InPortPicker',
    tags: ['autodocs'],
    render: (args: any) => {
        const output = new InPortPicker();
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


type Story = StoryObj<InPortPicker>;

export const Primary: Story = {
    args: {
        midiAccess: newMockMidiAccess()
    }
};

export const PortPresetToValidName: Story = {
    args: {
        midiAccess: newMockMidiAccess(),
        port: 'In Port 2'
    }
};

export const PortPresetToInvalidName: Story = {
    args: {
        midiAccess: newMockMidiAccess(),
        port: 'Made Up Port'
    }
}