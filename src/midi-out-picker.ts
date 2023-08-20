import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MidiOut, MidiAccess } from 'shimi';

@customElement('midi-out-picker')
export class MidiOutPicker extends LitElement {

    @property()
    midiAccess: MidiAccess | null = null;

    @property()
    midiOut: MidiOut | null = null;

    portNames(): Array<string> {
        if (!this.midiAccess)
            return [];
        return this.midiAccess.getOutPortNames();
    }

    private _onSelectedPortChange(evt: Event): void {
        if (!this.midiAccess)
            return;
        const select = evt.target as HTMLSelectElement;
        const newValue = this.midiAccess?.getOutPort(select.value);
        this.dispatchEvent(new CustomEvent('port-change', {
            detail: newValue,
            bubbles: true,
            composed: true
        }));
        if (this.midiOut)
            this.midiOut.port = newValue;
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
    'midi-out-picker': MidiOutPicker
  }
}