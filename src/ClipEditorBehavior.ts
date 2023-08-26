import { ClipEditorViewModel } from './ClipEditorViewModel';
import { ClipEditor } from './clip-editor';

export class ClipEditorBehavior {
    private _clipEditor: ClipEditor;

    private _viewModel: ClipEditorViewModel;

    constructor(clipEditor: ClipEditor, viewModel: ClipEditorViewModel) {
        this._clipEditor = clipEditor;
        this._viewModel = viewModel;
    }

    onMouseDown(cartesian: {x: number, y: number}, button: number) {
        const vm = this._viewModel;
        if (!vm.clip)
            return;
        if (button == 1) {
            //Remove note
        }
        else if (button == 0) {
            //Add note
            const beat = vm.getBeatFromX(cartesian.x);
            const pitch = vm.getPitchFromY(cartesian.y);
            vm.clip.addNote(beat, 1, pitch, 80);
            this._clipEditor.requestUpdate();
            console.log(vm.clip);
        }
    }
}