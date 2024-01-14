import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Scale, ScaleTemplate } from 'shimi';

@customElement('scale-picker')
export class ScalePicker extends LitElement {
    
    @property()
    scaleTemplates: Array<ScaleTemplate> = [];

    @state()
    private _selectedScaleTemplate: ScaleTemplate | null = null;

    @state()
    private _scales: Array<Scale> = [];

    @state()
    private _selectedScale: Scale | null = null;

    /** When scale template is changed, update available scales and clear out any currently selected scale */
    private _onSelectedScaleTemplateChange(evt: Event): void {
        const select = evt.target as HTMLSelectElement;
        this._selectedScaleTemplate = this.scaleTemplates.find(x => x.name == select.value) ?? null;
        this._recalculateScales();
        this._selectedScale = null;
    }

    /** Recalculates the collection of available scales to choose from */
    private _recalculateScales(): void {
        const result = [];
        if (this._selectedScaleTemplate) {
            for (let i = 0; i < 12; i++)
                result.push(this._selectedScaleTemplate.create(i));
        }
        this._scales = result;
    }

    /** When scale is changed, dispatches scale-change event */
    private _onSelectedScaleChange(evt: Event): void {
        const select = evt.target as HTMLSelectElement;
        this._selectedScale = this._scales
            .find(scale => scale.root.toString() == select.value) ?? null;
        this.dispatchEvent(new CustomEvent('scale-change', {
            detail: this._selectedScale,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const me = this;
        return html`
            <select @change=${me._onSelectedScaleTemplateChange}>
                <option></option>
                ${this.scaleTemplates.map(x => html`
                    <option>${x.name}</option>
                `)}
            </select>

            <select @change=${me._onSelectedScaleChange}>
                <option ?selected=${!me._selectedScale}></option>
                ${this._scales.map(scale => html`
                    <option value=${scale.root}>${scale.getPitchName(scale.root, false)}</option>
                `)}
            </select>
        `;
    }

    /** This causes the component to be rendered in the light DOM. Meaning that the basic layout of the picker can be more easily styled. */
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'scale-picker': ScalePicker
    }
}