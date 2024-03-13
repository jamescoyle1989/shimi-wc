import { IClockChild } from "shimi/dist/types/Clock";
import { ChordProgressionEditor } from "./chord-progression-editor";
import { ClockChildFinishedEvent, ClockChildFinishedEventData, ChordProgressionPlayer } from "shimi";

export class ChordProgressionEditorPlayhead implements IClockChild {

    private _chordProgressionEditor: ChordProgressionEditor;
    get chordProgressionEditor(): ChordProgressionEditor { return this._chordProgressionEditor; }

    private _chordProgressionPlayer: ChordProgressionPlayer;
    get chordProgressionPlayer(): ChordProgressionPlayer { return this._chordProgressionPlayer; }

    constructor(
        chordProgressionEditor: ChordProgressionEditor,
        chordProgressionPlayer: ChordProgressionPlayer
    ) {
        this._chordProgressionEditor = chordProgressionEditor;
        this._chordProgressionPlayer = chordProgressionPlayer;
    }

    get ref(): string { return this._ref; }
    set ref(value: string) { this._ref = value; }
    private _ref: string;

    withRef(ref: string): IClockChild {
        this._ref = ref;
        return this;
    }

    private _isFinished: boolean = false;
    get isFinished(): boolean { return this._isFinished || this._chordProgressionPlayer.isFinished; }

    get finished(): ClockChildFinishedEvent { return this._finished; }
    private _finished: ClockChildFinishedEvent = new ClockChildFinishedEvent();

    update(deltaMs: number): void {
        this._chordProgressionEditor.markPlayheadsForUpdate();
    }

    finish(): void {
        this._isFinished = true;
        this.finished.trigger(new ClockChildFinishedEventData(this));
    }

}