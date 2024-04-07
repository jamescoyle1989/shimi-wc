import{w as ge,i as pe,s as me,x as Ce,b}from"./lit-element-b97bcfb0.js";import{d as u,n as g,r as Pe,t as fe}from"./index-894feb9a.js";import{d as _,e as ve,i as _e,t as we,a as be,n as Me}from"./ClipEditorBehavior-be0d48a1.js";import{p as ye,v as M,r as y,h as U,m as xe}from"./directive-helpers-51f6ee5d.js";import"./_commonjsHelpers-725317a4.js";class Be{constructor(){this.chordProgression=null,this.chordFinder=new u.ChordFinder().withDefaultChordLookups(),this.xZoom=1,this.yZoom=1,this.beatsPerBar=4,this.divisionsPerBeat=2,this.maxBeatsPerLine=-1,this.lineBufferHeight=20,this.snapStrength=.05,this.chordResizeHandleArea=.1,this.scale=u.ScaleTemplate.major.create("C"),this.playheads=[],this.chordColor=(e,o)=>o?"#88FF8888":"#FF888888",this.canAddChord=e=>!0,this.canEditChordStart=e=>!0,this.canEditChordEnd=e=>!0,this.canEditChordPitches=e=>!0,this.canDeleteChord=e=>!0,this.chordsIncorrectlyModified=new Set}get beatWidth(){return 100*this.xZoom}set beatWidth(e){this.xZoom=e/100}get chordHeight(){return 100*this.yZoom}set chordHeight(e){this.yZoom=e/100}get totalBeats(){var e;return((e=this.chordProgression)==null?void 0:e.duration)??0}get beatsPerDivision(){return 1/this.divisionsPerBeat}get beatsPerLine(){return this.maxBeatsPerLine<=0?this.totalBeats:Math.min(this.totalBeats,this.maxBeatsPerLine)}get totalWidth(){return this.beatsPerLine*this.beatWidth}set totalWidth(e){const o=this.beatsPerLine;o<=0||(this.beatWidth=e/o)}get lineCount(){return this.maxBeatsPerLine<=0?1:Math.ceil(this.totalBeats/this.maxBeatsPerLine)}get totalHeight(){return this.chordHeight*this.lineCount+this.lineBufferHeight*(this.lineCount-1)}set totalHeight(e){const o=this.totalHeight;if(o<=0)return;const s=e/o;this.chordHeight*=s,this.lineBufferHeight*=s}getXFromBeat(e){return this.maxBeatsPerLine>0&&(e=e%this.maxBeatsPerLine),e*this.beatWidth}getYFromBeat(e){return this.totalBeats<=this.beatsPerLine?0:Math.floor(e/this.beatsPerLine)*(this.chordHeight+this.lineBufferHeight)}getBeatFromXY(e){const o=Math.floor(e.y/(this.chordHeight+this.lineBufferHeight));return e.y-o*(this.chordHeight+this.lineBufferHeight)>this.chordHeight?-1:Math.min(Math.max(0,e.x/this.beatWidth),this.beatsPerLine)+o*this.beatsPerLine}getBeatLines(){const e=[{beat:0,class:"bar-line"}];for(let s=0;s<this.beatsPerBar;s++){s>0&&e.push({beat:s,class:"beat-line"});for(let r=1;r<this.divisionsPerBeat;r++)e.push({beat:s+r/this.divisionsPerBeat,class:"division-line"})}const o=[];for(let s=0;s<this.totalBeats;s+=this.beatsPerBar)for(const r of e){const i=s+r.beat;i>=0&&i<=this.totalBeats&&o.push({beat:i,class:r.class})}return o}getNearestDivisionBeat(e){return Math.round(e*this.divisionsPerBeat)/this.divisionsPerBeat}getPreviousDivisionBeat(e){return Math.floor(e*this.divisionsPerBeat)/this.divisionsPerBeat}getNextDivisionBeat(e){return Math.ceil(e*this.divisionsPerBeat)/this.divisionsPerBeat}getSnappedBeat(e){const o=this.getNearestDivisionBeat(e);return Math.abs(e-o)<=this.beatsPerDivision*this.snapStrength?o:e}getChordNoteNamesLabel(e){let o="";const s=e.chord.pitches.map(r=>r%12);for(let r=0;r<s.length;r++){const i=s.indexOf(s[r]);i>=0&&i<r||(r>0&&(o+=","),o+=this.scale.getPitchName(s[r]))}return o}getChordGaps(){const e=this.chordProgression.chords.sort((s,r)=>s.start-r.start),o=new Array;if(e.length==0)o.push(new u.ChordProgressionChord(0,this.totalBeats,new u.Chord));else{e[0].start>0&&o.push(new u.ChordProgressionChord(0,e[0].start,new u.Chord));for(let r=1;r<e.length;r++){const i=e[r-1],n=e[r];i.end<n.start&&o.push(new u.ChordProgressionChord(i.end,n.start-i.end,new u.Chord))}const s=e[e.length-1];s.end<this.totalBeats&&o.push(new u.ChordProgressionChord(s.end,this.totalBeats-s.end,new u.Chord))}return o}getChordLineSectionBeats(e){const o=[];let s=e.start;for(;;){const i=(Math.floor(s/this.beatsPerLine)+1)*this.beatsPerLine;if(i>=this.totalBeats||i>=e.end){o.push({start:s,end:e.end});break}o.push({start:s,end:i}),s=i}return o}}class Ee{constructor(e,o){this._draggedChord=null,this._draggedNeighbourChord=null,this._dragOffset=0,this._dragMode=_.none,this._chordProgressionEditor=e,this._viewModel=o}onMouseDown(e,o){const s=this._viewModel;if(!s.chordProgression)return;const r=s.getBeatFromXY(e),i=s.chordProgression.getChordAt(r);i&&this._beginChordDrag(i,r)}onMouseMove(e){var n,c;const o=this._viewModel;if(!o.chordProgression||this._dragMode==_.none||!this._draggedChord)return;const s=(this._dragMode&_.noteStart)>0,r=(this._dragMode&_.noteEnd)>0;let i=o.getSnappedBeat(o.getBeatFromXY(e)-this._dragOffset);if(s){if(i<this._draggedChord.end){const m=((n=o.chordProgression.chords.filter(f=>f!==this._draggedChord&&f!==this._draggedNeighbourChord&&f.start<this._draggedChord.start).sort((f,a)=>a.end-f.end)[0])==null?void 0:n.end)??0;i=Math.max(i,m);const C=this._draggedChord.end;this._draggedChord.start=i,this._draggedChord.end=C,this._draggedNeighbourChord&&(this._draggedNeighbourChord.end=i)}}else if(r&&i>this._draggedChord.start){const m=((c=o.chordProgression.chords.filter(C=>C!==this._draggedChord&&C!==this._draggedNeighbourChord&&C.start>this._draggedChord.start).sort((C,f)=>C.end-f.end)[0])==null?void 0:c.start)??o.chordProgression.end;if(i=Math.min(i,m),this._draggedChord.end=i,this._draggedNeighbourChord){const C=this._draggedNeighbourChord.end;this._draggedNeighbourChord.start=i,this._draggedNeighbourChord.end=C}}this._chordProgressionEditor.requestUpdate()}onMouseUp(e,o){const s=this._viewModel;o==0&&(this._dragMode=_.none,s.chordProgression&&this._draggedChord&&this._draggedChord.duration<=0&&(s.chordProgression.chords=s.chordProgression.chords.filter(r=>r!==this._draggedChord)),this._draggedChord=null,this._chordProgressionEditor.requestUpdate())}onMouseLeave(e,o){this.onMouseUp(e,0)}onDoubleClick(e){const o=this._viewModel,s=o.getSnappedBeat(o.getBeatFromXY(e)),r=o.chordProgression.chords.find(i=>i.start==s);if(r){const i=o.chordProgression.chords.filter(n=>n.start<s).sort((n,c)=>c.start-n.start).find(n=>!0);i&&(o.chordProgression.removeChords(n=>n===r),i.end=r.end)}else{const i=o.chordProgression.getChordAt(s);i&&(o.chordProgression.addChord(s,i.end-s,i.chord.duplicate()),i.end=s)}this._chordProgressionEditor.requestUpdate()}onChordNameChanged(e,o){const s=this._viewModel;if(o==""&&s.canDeleteChord(e)){s.chordsIncorrectlyModified.delete(e),s.chordProgression.removeChords(i=>i===e),this._chordProgressionEditor.requestUpdate();return}let r=null;try{r=s.chordFinder.newChord(o)}catch{}r?(e.chord=r,s.chordsIncorrectlyModified.delete(e)):s.chordsIncorrectlyModified.add(e),this._chordProgressionEditor.requestUpdate()}onChordAdded(e){this._viewModel.chordProgression.addChord(e.start,e.duration,e.chord),this._chordProgressionEditor.requestUpdate()}_beginChordDrag(e,o){const s=this._viewModel;if(!s.chordProgression)return;const r=e.getPercent(o);let i=null;r<=s.chordResizeHandleArea&&s.canEditChordStart(e)?(this._dragMode=_.noteStart,i=s.chordProgression.chords.find(n=>n.end==e.start&&s.canEditChordEnd(n))):r>=1-s.chordResizeHandleArea&&s.canEditChordEnd(e)&&(this._dragMode=_.noteEnd,i=s.chordProgression.chords.find(n=>n.start==e.end&&s.canEditChordStart(n))),this._dragMode!=_.none&&(this._dragMode==_.noteEnd?this._dragOffset=o-e.end:this._dragOffset=o-e.start,this._draggedChord=e,this._draggedNeighbourChord=i,this._chordProgressionEditor.requestUpdate())}}class Fe{constructor(e,o){this._isFinished=!1,this._finished=new u.ClockChildFinishedEvent,this._chordProgressionEditor=e,this._chordProgressionPlayer=o}get chordProgressionEditor(){return this._chordProgressionEditor}get chordProgressionPlayer(){return this._chordProgressionPlayer}get ref(){return this._ref}set ref(e){this._ref=e}withRef(e){return this._ref=e,this}get isFinished(){return this._isFinished||this._chordProgressionPlayer.isFinished}get finished(){return this._finished}update(e){this._chordProgressionEditor.markPlayheadsForUpdate()}finish(){this._isFinished=!0,this.finished.trigger(new u.ClockChildFinishedEventData(this))}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=(t,e,o)=>{const s=new Map;for(let r=e;r<=o;r++)s.set(t[r],r);return s},Se=ve(class extends _e{constructor(t){if(super(t),t.type!==we.CHILD)throw Error("repeat() can only be used in text expressions")}ht(t,e,o){let s;o===void 0?o=e:e!==void 0&&(s=e);const r=[],i=[];let n=0;for(const c of t)r[n]=s?s(c,n):n,i[n]=o(c,n),n++;return{values:i,keys:r}}render(t,e,o){return this.ht(t,e,o).values}update(t,[e,o,s]){const r=ye(t),{values:i,keys:n}=this.ht(e,o,s);if(!Array.isArray(r))return this.dt=n,i;const c=this.dt??(this.dt=[]),m=[];let C,f,a=0,p=r.length-1,l=0,P=i.length-1;for(;a<=p&&l<=P;)if(r[a]===null)a++;else if(r[p]===null)p--;else if(c[a]===n[l])m[l]=M(r[a],i[l]),a++,l++;else if(c[p]===n[P])m[P]=M(r[p],i[P]),p--,P--;else if(c[a]===n[P])m[P]=M(r[a],i[P]),y(t,m[P+1],r[a]),a++,P--;else if(c[p]===n[l])m[l]=M(r[p],i[l]),y(t,r[a],r[p]),p--,l++;else if(C===void 0&&(C=q(n,l,P),f=q(c,a,p)),C.has(c[a]))if(C.has(c[p])){const v=f.get(n[l]),A=v!==void 0?r[v]:null;if(A===null){const N=y(t,r[a]);M(N,i[l]),m[l]=N}else m[l]=M(A,i[l]),y(t,r[a],A),r[v]=null;l++}else U(r[p]),p--;else U(r[a]),a++;for(;l<=P;){const v=y(t,m[P+1]);M(v,i[l]),m[l++]=v}for(;a<=p;){const v=r[a++];v!==null&&U(v)}return this.dt=n,xe(t,m),ge}});var $e=Object.defineProperty,Le=Object.getOwnPropertyDescriptor,h=(t,e,o,s)=>{for(var r=s>1?void 0:s?Le(e,o):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(r=(s?n(e,o,r):n(r))||r);return s&&r&&$e(e,o,r),r};let d=class extends me{constructor(){super(),this._viewModel=new Be,this._playheadUpdateTicker=0,this._svg=be(),this._svgPoint=null,this._behavior=new Ee(this,this._viewModel)}get chordProgression(){return this._viewModel.chordProgression}set chordProgression(t){const e=this._viewModel.chordProgression;this._viewModel.chordProgression=t,this.requestUpdate("chordProgression",e)}get chordFinder(){return this._viewModel.chordFinder}set chordFinder(t){const e=this._viewModel.chordFinder;this._viewModel.chordFinder=t,this.requestUpdate("chordFinder",e)}get xZoom(){return this._viewModel.xZoom}set xZoom(t){const e=this._viewModel.xZoom;this._viewModel.xZoom=t,this.requestUpdate("xZoom",e)}get yZoom(){return this._viewModel.yZoom}set yZoom(t){const e=this._viewModel.yZoom;this._viewModel.yZoom=t,this.requestUpdate("yZoom",e)}get width(){return this._viewModel.totalWidth}set width(t){const e=this._viewModel.totalWidth;this._viewModel.totalWidth=t,this.requestUpdate("width",e)}get height(){return this._viewModel.totalHeight}set height(t){const e=this._viewModel.totalHeight;this._viewModel.totalHeight=t,this.requestUpdate("height",e)}get beatsPerBar(){return this._viewModel.beatsPerBar}set beatsPerBar(t){const e=this._viewModel.beatsPerBar;this._viewModel.beatsPerBar=Math.max(1,Math.round(t)),this.requestUpdate("beatsPerBar",e)}get divisionsPerBeat(){return this._viewModel.divisionsPerBeat}set divisionsPerBeat(t){const e=this._viewModel.divisionsPerBeat;this._viewModel.divisionsPerBeat=Math.max(1,Math.round(t)),this.requestUpdate("divisionsPerBeat",e)}get maxBeatsPerLine(){return this._viewModel.maxBeatsPerLine}set maxBeatsPerLine(t){const e=this._viewModel.maxBeatsPerLine;let o=Math.round(t);o<=0&&(o=-1),this._viewModel.maxBeatsPerLine=o,this.requestUpdate("maxBeatsPerLine",e)}get snapStrength(){return this._viewModel.snapStrength}set snapStrength(t){const e=this._viewModel.snapStrength;this._viewModel.snapStrength=Math.min(Math.max(0,t),1),this.requestUpdate("snapStrength",e)}get chordResizeHandleArea(){return this._viewModel.chordResizeHandleArea}set chordResizeHandleArea(t){const e=this._viewModel.chordResizeHandleArea;this._viewModel.chordResizeHandleArea=Math.min(Math.max(0,t),1),this.requestUpdate("chordResizeHandleArea",e)}get scale(){return this._viewModel.scale}set scale(t){const e=this._viewModel.scale;this._viewModel.scale=t,this.requestUpdate("scale",e)}get chordColor(){return this._viewModel.chordColor}set chordColor(t){const e=this._viewModel.chordColor;this._viewModel.chordColor=t,this.requestUpdate("chordColor",e)}get canAddChord(){return this._viewModel.canAddChord}set canAddChord(t){const e=this._viewModel.canAddChord;this._viewModel.canAddChord=t,this.requestUpdate("canAddChord",e)}get canEditChordStart(){return this._viewModel.canEditChordStart}set canEditChordStart(t){const e=this._viewModel.canEditChordStart;this._viewModel.canEditChordStart=t,this.requestUpdate("canEditChordStart",e)}get canEditChordEnd(){return this._viewModel.canEditChordEnd}set canEditChordEnd(t){const e=this._viewModel.canEditChordEnd;this._viewModel.canEditChordEnd=t,this.requestUpdate("canEditChordEnd",e)}get canEditChordPitches(){return this._viewModel.canEditChordPitches}set canEditChordPitches(t){const e=this._viewModel.canEditChordPitches;this._viewModel.canEditChordPitches=t,this.requestUpdate("canEditChordPitches",e)}get canDeleteChord(){return this._viewModel.canDeleteChord}set canDeleteChord(t){const e=this._viewModel.canDeleteChord;this._viewModel.canDeleteChord=t,this.requestUpdate("canDeleteChord",e)}_getCursorPoint(t){const e=this._svg.value,o=this._svgPoint;return!o||!e?{x:-1,y:-1}:(o.x=t.clientX,o.y=t.clientY,o.matrixTransform(e.getScreenCTM().inverse()))}_onMouseDown(t){this._behavior.onMouseDown(this._getCursorPoint(t),t.button)}_onMouseMove(t){const e=this._getCursorPoint(t);this._behavior.onMouseMove(e)}_onMouseUp(t){this._behavior.onMouseUp(this._getCursorPoint(t),t.button)}_onMouseLeave(t){this._behavior.onMouseLeave(this._getCursorPoint(t),t.button)}_onDoubleClick(t){this._behavior.onDoubleClick(this._getCursorPoint(t))}addPlayhead(t){if(t.chordProgression!=this.chordProgression)throw Error("Cannot add a playhead for a chord progression player that's playing a different progression than the one being edited");const e=new Fe(this,t);return this._viewModel.playheads.push(e),e}markPlayheadsForUpdate(){this._playheadUpdateTicker=(this._playheadUpdateTicker+1)%1e3}firstUpdated(){const t=this._svg.value;this._svgPoint=t.createSVGPoint()}render(){const t=this._viewModel;return Ce`
            <svg xmlns="http://www.w3.org/2000/svg"
                :viewBox="0 0 ${t.totalWidth} ${t.totalHeight}"
                preserveAspectRatio="none"
                ${Me(this._svg)} class="edit-area"
                @mousedown=${this._onMouseDown}
                @mousemove=${this._onMouseMove}
                @mouseup=${this._onMouseUp}
                @mouseleave=${this._onMouseLeave}
                @dblclick=${this._onDoubleClick}
                width=${t.totalWidth}
                height=${t.totalHeight}>

                ${this._renderRows()}
                ${this._renderBeatLines()}
                ${this._renderChords()}
                ${this._renderChordGaps()}
                ${this._renderPlayheads()}
            </svg>
        `}_renderRows(){const t=this._viewModel,e=t.lineCount,o=[];for(let s=0;s<e;s++){const r=s*t.beatsPerLine,i=Math.min(t.totalBeats-r,t.beatsPerLine);o.push(b`
                <rect x="0" y=${s*(t.chordHeight+t.lineBufferHeight)}
                    width=${i*t.beatWidth}
                    height=${t.chordHeight}
                    fill="#666"></rect>
            `)}return o}_renderBeatLines(){const t=this._viewModel,e=[];for(const o of t.getBeatLines()){const s=t.getXFromBeat(o.beat),r=t.getYFromBeat(o.beat);e.push(b`
                <line x1=${s} y1=${r}
                    x2=${s} y2=${r+t.chordHeight}
                    class=${o.class}/>
            `)}return e}_getChordColor(t){const e=this._viewModel,o=!e.chordsIncorrectlyModified.has(t);return e.chordColor(t,o)}_renderChords(){var s;const t=this._viewModel,e=this._behavior,o=[];for(const r of((s=t.chordProgression)==null?void 0:s.chords)??[]){const i=t.getChordLineSectionBeats(r);o.push(...i.map((n,c)=>({chord:r,section:n,hasInput:c==0})))}return b`${Se(o,r=>`${r.chord.chord.name}_${r.section.start}_${r.section.end}`,r=>{const i=t.getXFromBeat(r.section.start),n=t.getYFromBeat(r.section.start);return b`
                    <rect x=${i} y=${n}
                            width=${(r.section.end-r.section.start)*t.beatWidth} height=${t.chordHeight}
                            stroke="black" stroke-width="0.5" fill=${this._getChordColor(r.chord)}>
                    </rect>
                    <text x=${i+5} y=${n+60} class="chord-label">${t.getChordNoteNamesLabel(r.chord)}</text>
                    ${r.hasInput?b`
                            <foreignObject x=${i} y=${n+20}
                                    width=${Math.min(100,(r.section.end-r.section.start)*t.beatWidth)}
                                    height="50">
                                <input xmlns="http://www.w3.org/1999/xhtml"
                                        type="text" value=${r.chord.chord.name}
                                        ?disabled=${!t.canEditChordPitches(r.chord)}
                                        @change=${c=>e.onChordNameChanged(r.chord,c.target.value)}>
                                </input>
                            </foreignObject>
                        `:""}
                `})}`}_renderChordGaps(){const t=this._viewModel,e=this._behavior,o=[];for(const s of t.getChordGaps().filter(r=>t.canAddChord(r))){const r=t.getXFromBeat(s.start),i=t.getYFromBeat(s.start);o.push(b`
                <foreignObject x=${r} y=${i+20}
                        width=${Math.min(100,s.duration*t.beatWidth)}
                        height="50">
                    <button xmlns="http://www.w3.org/1999/xhtml"
                        @click=${n=>e.onChordAdded(s)}>Add</button>
                </foreignObject>
            `)}return o}_renderPlayheads(){const t=this._viewModel,e=[];for(const o of t.playheads){const s=o.chordProgressionPlayer,r=(s.startBeat+s.beatsPassed)%this.chordProgression.duration,i=t.getXFromBeat(r),n=t.getYFromBeat(r);e.push(b`
                <line x1=${i} y1=${n} x2=${i} y2=${n+t.chordHeight} class="playhead"/>
            `)}return e}};d.styles=pe`
        .edit-area {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -ms-user-select: none;
        }

        .bar-line {
            stroke: #303030;
            stroke-width: 2;
            stroke-dasharray: 5,0;
        }

        .beat-line {
            stroke: #E0E0E0;
            stroke-width: 1;
            stroke-dasharray: 5,0;
        }

        .division-line {
            stroke: #A0A0A0;
            stroke-width: 1;
            stroke-dasharray: 2,5;
        }

        .playhead {
            stroke: #F02222;
            stroke-width: 2;
        }

        .chord-label {
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            font-size: 18px;
        }
    `;h([g({attribute:!1})],d.prototype,"chordProgression",1);h([g({attribute:!1})],d.prototype,"chordFinder",1);h([g({attribute:"x-zoom",type:Number})],d.prototype,"xZoom",1);h([g({attribute:"y-zoom",type:Number})],d.prototype,"yZoom",1);h([g({attribute:"width",type:Number})],d.prototype,"width",1);h([g({attribute:"height",type:Number})],d.prototype,"height",1);h([g({attribute:"beats-per-bar",type:Number,reflect:!0})],d.prototype,"beatsPerBar",1);h([g({attribute:"divisions-per-beat",type:Number,reflect:!0})],d.prototype,"divisionsPerBeat",1);h([g({attribute:"max-beats-per-line",type:Number,reflect:!0})],d.prototype,"maxBeatsPerLine",1);h([g({attribute:"snap-strength",type:Number,reflect:!0})],d.prototype,"snapStrength",1);h([g({attribute:"chord-resize-handle-area",type:Number,reflect:!0})],d.prototype,"chordResizeHandleArea",1);h([g({attribute:!1})],d.prototype,"scale",1);h([g({attribute:!1})],d.prototype,"chordColor",1);h([g({attribute:!1})],d.prototype,"canAddChord",1);h([g({attribute:!1})],d.prototype,"canEditChordStart",1);h([g({attribute:!1})],d.prototype,"canEditChordEnd",1);h([g({attribute:!1})],d.prototype,"canEditChordPitches",1);h([g({attribute:!1})],d.prototype,"canDeleteChord",1);h([Pe()],d.prototype,"_playheadUpdateTicker",2);d=h([fe("chord-progression-editor")],d);const Ze={title:"ChordProgressionEditor",tags:["autodocs"],render:t=>{const e=new d;for(const o in t)e[o]=t[o];return e},argTypes:{chordProgression:{control:"none",description:"The shimi.ChordProgression object which the ChordProgressionEditor will display and enable editing of."},xZoom:{control:{type:"number",min:.5,max:2,step:.1},description:"Multiplier to be used when rendering x-coordinates in the component."},yZoom:{control:{type:"number",min:.5,max:2,step:.1},description:"Multiplier to be used when rendering y-coordinates in the component."},width:{control:{type:"number",min:100,max:1e3,step:10},description:"Controls the total width of the component."},height:{control:{type:"number",min:100,max:1e3,step:10},description:"Controls the total height of the component."},beatsPerBar:{control:{type:"number",min:1,max:8,step:1},description:"How many beat lines to render before a bar line occurs"},divisionsPerBeat:{control:{type:"number",min:1,max:8,step:1},description:"How many subdivisions to render per beat. These provide a useful visual cue where each beat divides, as well as note snapping."},maxBeatsPerLine:{control:{type:"number",min:-1,max:16,step:1},description:"How many beats can fit onto a single line before wrapping around to a new one."},snapStrength:{control:{type:"number",min:0,max:1,step:.01},description:"How strongly note starts & ends will snap to beat divisions. Default value = 0.05, meaning that given the distance from one beat division to the next, a note start or end must be within 5% of that distance from the division to snap to it."},scale:{control:"none",description:"The scale object to use when looking up relative chord names."},chordColor:{control:"none",description:"Function that takes a ChordProgressionChord and boolean of whether it's valid. Returns color as string."},canAddChord:{control:"none",description:"Function that takes a ChordProgressionChord, returns whether such a chord could be added to the progression."},canEditChordStart:{control:"none",description:"Function that takes a ChordProgressionChord, returns whether the chord start can be altered."},canEditChordEnd:{control:"none",description:"Function that takes a ChordProgressionChord, returns whether the chord end can be altered."},canEditChordPitches:{control:"none",description:"Function that takes a ChordProgressionChord, returns whether the shape of the chord can be altered via updating its name."},canDeleteChord:{control:"none",description:"Function that takes a ChordProgressionChord, returns whether the chord can be removed from the progression."}}},Z=u.ScaleTemplate.major.create("C"),x=new u.ChordFinder().withDefaultChordLookups();u.Chord.nameGenerator=t=>{const e=x.findChord(t.pitches,t.root,null,Z);return e==null?null:e.name.replace("{r}",Z.getPitchName(e.root)).replace("{r}",Z.getPitchName(e.bass))};function w(){return new u.ChordProgression(16).addChord(0,4,x.newChord("C")).addChord(4,4,x.newChord("G")).addChord(8,4,x.newChord("Am")).addChord(12,4,x.newChord("F"))}const B={args:{chordProgression:w()}},E={args:{chordProgression:w(),maxBeatsPerLine:8}},F={args:{chordProgression:w(),maxBeatsPerLine:8},play:async({canvasElement:t})=>{const e=t.children.item(0),o=new u.Clock,s=o.addChild(new u.Metronome(120)),r=o.addChild(new u.ChordProgressionPlayer(e.chordProgression,s));o.addChild(e.addPlayhead(r)),o.start()}},S={args:{chordProgression:w(),xZoom:.5,chordColor:(t,e)=>e?t.start<4?"#FFFF8888":t.start<8?"#88FF8888":t.start<12?"#88FFFF88":"#8888FF88":"#FF888888"}},$={args:{chordProgression:(()=>{const t=w();return t.removeChords(e=>e.start==4),t})(),xZoom:.5,canAddChord:t=>!1}},L={args:{chordProgression:w(),xZoom:.5,canEditChordPitches:t=>t.start%8==0}},D={args:{chordProgression:w(),xZoom:.5,canEditChordStart:t=>t.chord.name!="G"}},k={args:{chordProgression:w(),xZoom:.5,canEditChordEnd:t=>t.chord.name!="G"}},H={args:{chordProgression:w(),xZoom:.5,canDeleteChord:t=>!1}};var V,O,G;B.parameters={...B.parameters,docs:{...(V=B.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour()
  }
}`,...(G=(O=B.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var W,R,z;E.parameters={...E.parameters,docs:{...(W=E.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    maxBeatsPerLine: 8
  }
}`,...(z=(R=E.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var I,T,X;F.parameters={...F.parameters,docs:{...(I=F.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    maxBeatsPerLine: 8
  },
  play: async ({
    canvasElement
  }) => {
    const editor = (canvasElement.children.item(0) as ChordProgressionEditor);
    const clock = new Clock();
    const metronome = (clock.addChild(new Metronome(120)) as Metronome);
    const player = (clock.addChild(new ChordProgressionPlayer(editor.chordProgression, metronome)) as ChordProgressionPlayer);
    clock.addChild(editor.addPlayhead(player));
    clock.start();
  }
}`,...(X=(T=F.parameters)==null?void 0:T.docs)==null?void 0:X.source}}};var Y,j,J;S.parameters={...S.parameters,docs:{...(Y=S.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    xZoom: 0.5,
    chordColor: (chord, isValid) => {
      if (!isValid) return '#FF888888';
      if (chord.start < 4) return '#FFFF8888';
      if (chord.start < 8) return '#88FF8888';
      if (chord.start < 12) return '#88FFFF88';
      return '#8888FF88';
    }
  }
}`,...(J=(j=S.parameters)==null?void 0:j.docs)==null?void 0:J.source}}};var K,Q,ee;$.parameters={...$.parameters,docs:{...(K=$.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    chordProgression: (() => {
      const output = oneFiveSixFour();
      output.removeChords(x => x.start == 4);
      return output;
    })(),
    xZoom: 0.5,
    canAddChord: c => false
  }
}`,...(ee=(Q=$.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};var te,re,oe;L.parameters={...L.parameters,docs:{...(te=L.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    xZoom: 0.5,
    canEditChordPitches: c => c.start % 8 == 0
  }
}`,...(oe=(re=L.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var se,ie,ne;D.parameters={...D.parameters,docs:{...(se=D.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    xZoom: 0.5,
    canEditChordStart: c => c.chord.name != 'G'
  }
}`,...(ne=(ie=D.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var de,ae,he;k.parameters={...k.parameters,docs:{...(de=k.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    xZoom: 0.5,
    canEditChordEnd: c => c.chord.name != 'G'
  }
}`,...(he=(ae=k.parameters)==null?void 0:ae.docs)==null?void 0:he.source}}};var ce,le,ue;H.parameters={...H.parameters,docs:{...(ce=H.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    chordProgression: oneFiveSixFour(),
    xZoom: 0.5,
    canDeleteChord: c => false
  }
}`,...(ue=(le=H.parameters)==null?void 0:le.docs)==null?void 0:ue.source}}};const Ne=["Primary","SplitOverMultipleLines","Playhead","MultipleColors","CanDisableAddingNewChords","CanDisableEditingChordPitches","CanDisableEditingStartOfGChord","CanDisableEditingEndOfGChord","CanDisableDeletionOfChords"];export{$ as CanDisableAddingNewChords,H as CanDisableDeletionOfChords,L as CanDisableEditingChordPitches,k as CanDisableEditingEndOfGChord,D as CanDisableEditingStartOfGChord,S as MultipleColors,F as Playhead,B as Primary,E as SplitOverMultipleLines,Ne as __namedExportsOrder,Ze as default};
