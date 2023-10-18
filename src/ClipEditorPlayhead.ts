import { IClockChild } from "shimi/dist/types/Clock";
import { ClipEditor } from "./clip-editor";
import { ClockChildFinishedEvent, ClockChildFinishedEventData, ClipPlayer } from "shimi";

export class ClipEditorPlayhead implements IClockChild {

    private _clipEditor: ClipEditor;
    get clipEditor(): ClipEditor { return this._clipEditor; }

    private _clipPlayer: ClipPlayer;
    get clipPlayer(): ClipPlayer { return this._clipPlayer; }

    constructor(clipEditor: ClipEditor, clipPlayer: ClipPlayer) {
        this._clipEditor = clipEditor;
        this._clipPlayer = clipPlayer;
    }
    
    get ref(): string { return this._ref; }
    set ref(value: string) { this._ref = value; }
    private _ref: string;

    withRef(ref: string): IClockChild {
        this._ref = ref;
        return this;
    }

    private _isFinished: boolean = false;
    get isFinished(): boolean { return this._isFinished || this._clipPlayer.isFinished; }

    get finished(): ClockChildFinishedEvent { return this._finished; }
    private _finished: ClockChildFinishedEvent = new ClockChildFinishedEvent();

    update(deltaMs: number): void {
        this._clipEditor.markPlayheadsForUpdate();
    }

    finish(): void {
        this._isFinished = true;
        this.finished.trigger(new ClockChildFinishedEventData(this));
    }

}