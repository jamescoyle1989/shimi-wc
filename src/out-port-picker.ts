import { customElement, property } from 'lit/decorators.js';
import { MidiOut } from 'shimi';
import { BasePortPicker } from './base-port-picker';

@customElement('out-port-picker')
export class OutPortPicker extends BasePortPicker {

    /**
     * Holds a reference to a MidiOut object which gets updated with the selected port
     * This is optional to set, and is really provided just as a convenience over
     * listening for the port-change event to update MidiOut
     */
    @property({attribute: false})
    private _midiOut: MidiOut | null = null;
    get midiOut(): MidiOut | null { return this._midiOut; }
    set midiOut(value: MidiOut | null) {
        if (value === this._midiOut)
            return;
        this._midiOut = value;
        this._propogatePortChange();
    }

    _getPortNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getOutPortNames();
    }

    _getPortObject(portName: string): any {
        return this.midiAccess?.getOutPort(portName);
    }

    _updateMidiIOObject(portObject: any): void {
        if (this.midiOut)
            this.midiOut.port = portObject;
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'out-port-picker': OutPortPicker
    }
}