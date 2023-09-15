import{w as v}from"./decorator-11a2d154.js";import{s as w,x as m}from"./lit-element-3795bd65.js";import{t as d,n as P,e as y,d as h}from"./index-88dafb31.js";import"./chunk-AY7I2SME-f06e2be0.js";import"./_commonjsHelpers-725317a4.js";var $=Object.defineProperty,b=Object.getOwnPropertyDescriptor,c=(t,e,s,r)=>{for(var a=r>1?void 0:r?b(e,s):e,p=t.length-1,i;p>=0;p--)(i=t[p])&&(a=(r?i(e,s,a):i(a))||a);return r&&a&&$(e,s,a),a};let l=class extends w{constructor(){super(...arguments),this.scaleTemplates=[],this._selectedScaleTemplate=null,this._scales=[],this._selectedScale=null}_onSelectedScaleTemplateChange(t){const e=t.target;this._selectedScaleTemplate=this.scaleTemplates.find(s=>s.name==e.value)??null,this._recalculateScales(),this._selectedScale=null}_recalculateScales(){const t=[];if(this._selectedScaleTemplate)for(let e=0;e<12;e++)t.push(this._selectedScaleTemplate.create(e));this._scales=t}_onSelectedScaleChange(t){const e=t.target;this._selectedScale=this._scales.find(s=>s.root.toString()==e.value)??null,this.dispatchEvent(new CustomEvent("scale-change",{detail:this._selectedScale,bubbles:!0,composed:!0}))}render(){const t=this;return m`
            <select @change=${t._onSelectedScaleTemplateChange}>
                <option></option>
                ${this.scaleTemplates.map(e=>m`
                    <option>${e.name}</option>
                `)}
            </select>

            <select @change=${t._onSelectedScaleChange}>
                <option ?selected=${!t._selectedScale}></option>
                ${this._scales.map(e=>m`
                    <option value=${e.root}>${e.getPitchName(e.root,!1)}</option>
                `)}
            </select>
        `}createRenderRoot(){return this}};c([P()],l.prototype,"scaleTemplates",2);c([d()],l.prototype,"_selectedScaleTemplate",2);c([d()],l.prototype,"_scales",2);c([d()],l.prototype,"_selectedScale",2);l=c([y("scale-picker")],l);const N={title:"ScalePicker",tags:["autodocs"],render:t=>{const e=new l;for(const s in t)e[s]=t[s];return e},argTypes:{scaleTemplates:{description:"A collection of shimi.ScaleTemplate objects. This defines which scale types that the user is allowed to select from in the first dropdown."}},parameters:{actions:{handles:["scale-change"]}},decorators:[v]},o={args:{scaleTemplates:[h.ScaleTemplate.major,h.ScaleTemplate.naturalMinor]}},n={args:{}};var u,S,_;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    scaleTemplates: [ScaleTemplate.major, ScaleTemplate.naturalMinor]
  }
}`,...(_=(S=o.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var T,g,f;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {}
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const A=["Primary","ScaleTemplatesNotSet"];export{o as Primary,n as ScaleTemplatesNotSet,A as __namedExportsOrder,N as default};
//# sourceMappingURL=ScalePicker.stories-b374a8ad.js.map
