import { MidiAccessPortEvent } from 'shimi';


export function newMockMidiAccess(): any {
    return {
        portChanged: new MidiAccessPortEvent(),

        getOutPort: function(portName: string): any {
            return { name: portName }
        },

        getInPort: function(portName: string): any {
            return { name: portName }
        },

        getOutPortNames: function(): string[] {
            return ['Out Port 1', 'Out Port 2'];
        },

        getInPortNames: function(): string[] {
            return ['In Port 1', 'In Port 2'];
        }
    };
}