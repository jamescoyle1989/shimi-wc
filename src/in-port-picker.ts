import { customElement, property } from 'lit/decorators.js';
import { MidiIn } from 'shimi';
import { BasePortPicker } from './base-port-picker';

@customElement('in-port-picker')
export class InPortPicker extends BasePortPicker {

    /**
     * Holds a reference to a MidiIn object which gets updated with the selected port
     * This is optional to set, and is really provided just as a convenience over
     * listening for the port-change event to update MidiIn
     */
    @property({attribute: false})
    private _midiIn: MidiIn | null = null;
    get midiIn(): MidiIn | null { return this._midiIn; }
    set midiIn(value: MidiIn | null) {
        if (value === this._midiIn)
            return;
        this._midiIn = value;
        this._propogatePortChange();
    }

    _getPortNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getInPortNames();
    }

    _getPortObject(portName: string): any {
        return this.midiAccess?.getInPort(portName);
    }

    _updateMidiIOObject(portObject: any): void {
        if (this.midiIn)
            this.midiIn.port = portObject;
    }
    
}

declare global {
    interface HTMLElementTagNameMap {
        'in-port-picker': InPortPicker
    }
}