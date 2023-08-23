import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MidiOut, MidiAccess } from 'shimi';

@customElement('out-port-picker')
export class OutPortPicker extends LitElement {

    @property()
    private _midiAccess: MidiAccess | null = null;
    get midiAccess(): MidiAccess | null { return this._midiAccess; }
    set midiAccess(value: MidiAccess | null) {
        if (this._midiAccess != null)
            this._midiAccess.portChanged.remove(x => x.logic === this._onMidiAccessPortChange);
        this._midiAccess = value;
        if (this._midiAccess != null)
            this._midiAccess.portChanged.add(this._onMidiAccessPortChange);
    }

    @property()
    midiOut: MidiOut | null = null;

    @state()
    private _port: string = '';

    portNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getOutPortNames();
    }

    private _onMidiAccessPortChange = () => {
        this.requestUpdate();
    }

    private _onSelectedPortChange(evt: Event): void {
        if (!this.midiAccess)
            return;
        const select = evt.target as HTMLSelectElement;
        const newValue = this.midiAccess?.getOutPort(select.value);
        this._port = select.value;
        if (this.midiOut)
            this.midiOut.port = newValue;
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
                <option ?selected=${me._port == ''}></option>
                ${this.portNames().map(portName => html`
                    <option>${portName}</option>
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