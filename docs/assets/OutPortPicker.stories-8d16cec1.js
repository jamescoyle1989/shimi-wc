import{n as k,t as T}from"./index-999147a9.js";import{B as j,n as p}from"./Mocks-a8473998.js";import"./lit-element-f39d4945.js";import"./_commonjsHelpers-725317a4.js";var I=Object.defineProperty,N=Object.getOwnPropertyDescriptor,b=(e,t,s,o)=>{for(var r=o>1?void 0:o?N(t,s):t,m=e.length-1,u;m>=0;m--)(u=e[m])&&(r=(o?u(t,s,r):u(r))||r);return o&&r&&I(t,s,r),r};let d=class extends j{constructor(){super(...arguments),this._midiOut=null}get midiOut(){return this._midiOut}set midiOut(e){e!==this._midiOut&&(this._midiOut=e,this._propogatePortChange())}_getPortNames(){return this.midiAccess?this.midiAccess.getOutPortNames():[]}_getPortObject(e){var t;return(t=this.midiAccess)==null?void 0:t.getOutPort(e)}_updateMidiIOObject(e){this.midiOut&&(this.midiOut.port=e)}};b([k({attribute:!1})],d.prototype,"_midiOut",2);d=b([T("out-port-picker")],d);const B={title:"OutPortPicker",tags:["autodocs"],render:e=>{const t=new d;for(const s in e)t[s]=e[s];return t},argTypes:{midiAccess:{control:"none",description:"Holds a reference to a shimi.MidiAccess object, used to fetch MIDI-Out ports that can be connected to. This also enables the control to listen for newly added/removed ports and update itself accordingly. This property must be set for the component to be in any way useful."},port:{control:{type:"text"},description:"The name of the selected port. If this is set to a value which doesn't correspond to an available port name, then the component will simply show no port selected. This property will be updated when the user selects new dropdown values, as well as a port-change event being fired."},midiOut:{control:"none",description:"Holds a reference to a shimi.MidiOut object, which gets updated with the selected port when changed. This is optional to set, and is really provided just as a convenience over listening for the port-change event to update the MidiOut."}},parameters:{actions:{handles:["port-change"]}}},i={args:{midiAccess:p()}},c={args:{midiAccess:p(),port:"Out Port 2"}},a={args:{midiAccess:p(),port:"Made Up Port"}},n={args:{midiAccess:p()},play:async({canvasElement:e})=>{e.children.item(0).midiAccess.mockAddOutPort("Out Port 3")}};var l,h,P;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess()
  }
}`,...(P=(h=i.parameters)==null?void 0:h.docs)==null?void 0:P.source}}};var O,g,A;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess(),
    port: 'Out Port 2'
  }
}`,...(A=(g=c.parameters)==null?void 0:g.docs)==null?void 0:A.source}}};var f,w,v;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess(),
    port: 'Made Up Port'
  }
}`,...(v=(w=a.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var y,M,_;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    midiAccess: newMockMidiAccess()
  },
  play: async ({
    canvasElement
  }) => {
    const outPicker = (canvasElement.children.item(0) as OutPortPicker);
    (outPicker.midiAccess as any).mockAddOutPort('Out Port 3');
  }
}`,...(_=(M=n.parameters)==null?void 0:M.docs)==null?void 0:_.source}}};const C=["Primary","PortPresetToValidName","PortPresetToInvalidName","AdditionalPortAdded"];export{n as AdditionalPortAdded,a as PortPresetToInvalidName,c as PortPresetToValidName,i as Primary,C as __namedExportsOrder,B as default};
