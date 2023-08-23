import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MidiOut, MidiAccess } from 'shimi';

@customElement('out-port-picker')
export class OutPortPicker extends LitElement {

    /**
     * Holds a reference to the MidiAccess object used to fetch MIDI ports
     * Setting this property manages a subscription to the MidiAccess.portChanged event
     * This must be set for the picker to be in any way useful
     */
    @property({attribute: false})
    private _midiAccess: MidiAccess | null = null;
    get midiAccess(): MidiAccess | null { return this._midiAccess; }
    set midiAccess(value: MidiAccess | null) {
        if (value === this._midiAccess)
            return;
        if (this._midiAccess != null)
            this._midiAccess.portChanged.remove(x => x.logic === this._onMidiAccessPortChange);
        this._midiAccess = value;
        if (this._midiAccess != null)
            this._midiAccess.portChanged.add(this._onMidiAccessPortChange);
        this._propogatePortChange();
    }

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

    /**
     * The name of the selected port
     */
    @property({attribute: 'port'})
    private _port: string = '';
    get port() { return this._port; }
    set port(value: string) {
        if (value == this._port)
            return;
        this._port = value;
        this._propogatePortChange();
    }

    @state()
    private _selectedMidiOutput: any | null = null;

    private _portIsValid(): boolean {
        return !!this._portNames().find(x => x == this.port);
    }

    private _portNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getOutPortNames();
    }

    //Gets called when a port has been added to/removed from the connected midi access object
    private _onMidiAccessPortChange = () => {
        this.requestUpdate();
    }

    //Gets called when a new port name is chosen through the select dropdown
    private _onSelectedPortChange(evt: Event): void {
        const select = evt.target as HTMLSelectElement;
        this.port = select.value;
    }

    //Responds to a change on one of the properties
    //Tries to find the actual port object with that name
    //Will update the midiOut, if its been set
    //and dispatch a port-change event if the value is different than it was before
    private _propogatePortChange(): void {
        const newValue = this.midiAccess?.getInPort(this.port);
        if (this.midiOut)
            this.midiOut.port = newValue;
        if (newValue == this._selectedMidiOutput)
            return;
        this._selectedMidiOutput = newValue;
        this.dispatchEvent(new CustomEvent('port-change', {
            detail: newValue,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const me = this;
        return html`
            <select @change=${me._onSelectedPortChange}>
                <option ?selected=${!me._portIsValid()}></option>
                ${this._portNames().map(portName => html`
                    <option ?selected=${me.port == portName}>${portName}</option>
                `)}
            </select>
        `;
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'out-port-picker': OutPortPicker
    }
}