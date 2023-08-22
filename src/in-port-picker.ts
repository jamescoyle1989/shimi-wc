import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MidiIn, MidiAccess } from 'shimi';

@customElement('in-port-picker')
export class InPortPicker extends LitElement {

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
    midiIn: MidiIn | null = null;

    portNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getInPortNames();
    }

    private _onMidiAccessPortChange = () => {
        this.requestUpdate();
    }

    private _onSelectedPortChange(evt: Event): void {
        if (!this.midiAccess)
            return;
        const select = evt.target as HTMLSelectElement;
        const newValue = this.midiAccess?.getInPort(select.value);
        if (this.midiIn)
            this.midiIn.port = newValue;
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
                ${this.portNames().map(portName => html`
                    <option>${portName}</option>
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