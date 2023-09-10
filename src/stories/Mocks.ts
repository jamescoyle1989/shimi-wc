import { MidiAccessPortEvent, MidiAccessPortEventData } from 'shimi';


export function newMockMidiAccess(): any {
    return {
        portChanged: new MidiAccessPortEvent(),

        getOutPort: function(portName: string): any {
            return { name: portName }
        },

        getInPort: function(portName: string): any {
            return { name: portName }
        },

        _outPortNames: ['Out Port 1', 'Out Port 2'],
        getOutPortNames: function(): string[] {
            return this._outPortNames;
        },

        _inPortNames: ['In Port 1', 'In Port 2'],
        getInPortNames: function(): string[] {
            return this._inPortNames;
        },

        mockAddOutPort: function(portName: string): void {
            this._outPortNames.push(portName);
            this.portChanged.trigger(new MidiAccessPortEventData(this, this.getOutPort(portName)));
        },

        mockAddInPort: function(portName: string): void {
            this._inPortNames.push(portName);
            this.portChanged.trigger(new MidiAccessPortEventData(this, this.getInPort(portName)));
        }
    };
}