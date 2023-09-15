import{w as k}from"./decorator-11a2d154.js";import{n as T,e as O}from"./index-88dafb31.js";import{B as j,n as p}from"./Mocks-39d4248a.js";import"./chunk-AY7I2SME-f06e2be0.js";import"./_commonjsHelpers-725317a4.js";import"./lit-element-3795bd65.js";var N=Object.defineProperty,x=Object.getOwnPropertyDescriptor,b=(e,t,s,o)=>{for(var r=o>1?void 0:o?x(t,s):t,m=e.length-1,l;m>=0;m--)(l=e[m])&&(r=(o?l(t,s,r):l(r))||r);return o&&r&&N(t,s,r),r};let d=class extends j{constructor(){super(...arguments),this._midiIn=null}get midiIn(){return this._midiIn}set midiIn(e){e!==this._midiIn&&(this._midiIn=e,this._propogatePortChange())}_getPortNames(){return this.midiAccess?this.midiAccess.getInPortNames():[]}_getPortObject(e){var t;return(t=this.midiAccess)==null?void 0:t.getInPort(e)}_updateMidiIOObject(e){this.midiIn&&(this.midiIn.port=e)}};b([T({attribute:!1})],d.prototype,"_midiIn",2);d=b([O("in-port-picker")],d);const U={title:"InPortPicker",tags:["autodocs"],render:e=>{const t=new d;for(const s in e)t[s]=e[s];return t},argTypes:{midiAccess:{control:"none",description:"Holds a reference to a shimi.MidiAccess object, used to fetch MIDI-In ports that can be connected to. This also enables the control to listen for newly added/removed ports and update itself accordingly. This property must be set for the component to be in any way useful."},port:{control:{type:"text"},description:"The name of the selected port. If this is set to a value which doesn't correspond to an available port name, then the component will simply show no port selected. This property will be updated when the user selects new dropdown values, as well as a port-change event being fired."},midiIn:{control:"none",description:"Holds a reference to a shimi.MidiIn object, which gets updated with the selected port when changed. This is optional to set, and is really provided just as a convenience over listening for the port-change event to update the MidiIn."}},parameters:{actions:{handles:["port-change"]}},decorators:[k]},i={args:{midiAccess:p()}},n={args:{midiAccess:p(),port:"In Port 2"}},c={args:{midiAccess:p(),port:"Made Up Port"}},a={args:{midiAccess:p()},play:async({canvasElement:e})=>{e.children.item(0).midiAccess.mockAddInPort("In Port 3")}};var h,u,P;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess()
  }
}`,...(P=(u=i.parameters)==null?void 0:u.docs)==null?void 0:P.source}}};var I,g,A;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess(),
    port: 'In Port 2'
  }
}`,...(A=(g=n.parameters)==null?void 0:g.docs)==null?void 0:A.source}}};var f,w,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess(),
    port: 'Made Up Port'
  }
}`,...(v=(w=c.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var y,M,_;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess()
  },
  play: async ({
    canvasElement
  }) => {
    const inPicker = (canvasElement.children.item(0) as InPortPicker);
    (inPicker.midiAccess as any).mockAddInPort('In Port 3');
  }
}`,...(_=(M=a.parameters)==null?void 0:M.docs)==null?void 0:_.source}}};const V=["Primary","PortPresetToValidName","PortPresetToInvalidName","AdditionalPortAdded"];export{a as AdditionalPortAdded,c as PortPresetToInvalidName,n as PortPresetToValidName,i as Primary,V as __namedExportsOrder,U as default};
//# sourceMappingURL=InPortPicker.stories-7204d32c.js.map
