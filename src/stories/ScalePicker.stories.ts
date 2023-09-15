import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { ScalePicker } from '../scale-picker';
import { ScaleTemplate } from 'shimi';


const meta: Meta<ScalePicker> = {
    title: 'ScalePicker',
    tags: ['autodocs'],
    render: (args: any) => {
        const output = new ScalePicker();
        for (const prop in args)
            (output as any)[prop] = args[prop];
        return output;
    },
    argTypes: {
        scaleTemplates: {
            description: 'A collection of shimi.ScaleTemplate objects. This defines which scale types that the user is allowed to select from in the first dropdown.'
        }
    },
    parameters: {
        actions: {
            handles: ['scale-change']
        }
    },
    decorators: [withActions]
};
export default meta;


type Story = StoryObj<ScalePicker>;

export const Primary: Story = {
    args: {
        scaleTemplates: [ScaleTemplate.major, ScaleTemplate.naturalMinor]
    }
};

export const ScaleTemplatesNotSet: Story = {
    args: {
    }
};