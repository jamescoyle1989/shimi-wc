import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { MidiAccess } from "shimi";

export abstract class BasePortPicker extends LitElement {

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
    private _selectedMidiPortObject: any | null = null;

    private _portIsValid(): boolean {
        return !!this._getPortNames().find(x => x == this.port);
    }

    abstract _getPortNames(): Array<string>;

    abstract _getPortObject(portName: string): any;

    abstract _updateMidiIOObject(portObject: any): void;

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
    protected _propogatePortChange(): void {
        const newValue = this._getPortObject(this.port);
        this._updateMidiIOObject(newValue);
        if (newValue == this._selectedMidiPortObject)
            return;
        this._selectedMidiPortObject = newValue;
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
                ${this._getPortNames().map(portName => html`
                    <option ?selected=${me.port == portName}>${portName}</option>
                `)}
            </select>
        `;
    }

    /** This causes the component to be rendered in the light DOM. Meaning that the basic layout of the picker can be more easily styled. */
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

}