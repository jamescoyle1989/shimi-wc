import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MidiIn, MidiAccess } from 'shimi';

@customElement('in-port-picker')
export class InPortPicker extends LitElement {

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
    private _selectedMidiInput: any | null = null;

    private _portIsValid(): boolean {
        return !!this._portNames().find(x => x == this.port);
    }

    private _portNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getInPortNames();
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
    //Will update the midiIn, if its been set
    //and dispatch a port-change event if the value is different than it was before
    private _propogatePortChange(): void {
        const newValue = this.midiAccess?.getInPort(this.port);
        if (this.midiIn)
            this.midiIn.port = newValue;
        if (newValue == this._selectedMidiInput)
            return;
        this._selectedMidiInput = newValue;
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
        'in-port-picker': InPortPicker
    }
}