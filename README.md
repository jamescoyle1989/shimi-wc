# Shimi-wc

![logo](https://raw.githubusercontent.com/jamescoyle1989/shimi-wc/master/src/assets/logo180px.png)

## Overview

Shimi-wc is a small collection of web components to aid in the creation of powerful MIDI applications with [Shimi](https://github.com/jamescoyle1989/shimi).

Shimi came out of a desire to easily build new and experimental MIDI instruments out of user input devices, and these components are designed to provide easy support for visualizing/manipulating the MIDI data that you're working with.

The library currently only contains a few components...

- **&lt;clip-editor&gt;** - Draws the notes from a clip object, allowing the user to manipulate the notes within the clip.

- **&lt;in-port-picker&gt;** - Connects to available MIDI-in ports on your computer, providing a dropdown of ports to pick from.

- **&lt;out-port-picker&gt;** - Connects to available MIDI-out ports on your computer, providing a dropdown of ports to pick from.

- **&lt;scale-picker&gt;** - Allows users to select the type of scale they want, then the specific root they'd like that scale to have, returning an event with the requested scale object.

- **&lt;chord-progression-editor&gt;** - Draws the chords from a chord progression object, allowing the user to manipulate the chords within the progression.


## Install

Shimi-wc works with objects from [Shimi](https://github.com/jamescoyle1989/shimi), which needs to be installed alongside it:

```
$ npm install shimi shimi-wc
```

Importing shimi-wc registers all of its custom elements:

```js
import { Clip } from 'shimi';
import 'shimi-wc';

document.querySelector('clip-editor').clip = new Clip(8);
```

The package also exports the component classes and full width strategies, along with TypeScript types:

```ts
import { ClipEditor, StretchClipEditorFullWidthStrategy } from 'shimi-wc';
```


## Using from a script tag

Shimi-wc can also be loaded from a CDN with no build step. Load shimi first, since shimi-wc uses the global `shimi` object that it creates. Here is a simple example, displaying a clip editor that allows editing of the first 2 bars of 'twinkle twinkle':

```html
<script src="https://unpkg.com/shimi"></script>
<script src="https://unpkg.com/shimi-wc"></script>

<clip-editor id="clipEditor" min-pitch="C3" max-pitch="C5"></clip-editor>

<script>
const clipEditor = document.getElementById('clipEditor');
clipEditor.clip = new shimi.Clip(8)
    .addNote([0,1], 1, 'C4', 80)
    .addNote([2,3], 1, 'G4', 80)
    .addNote([4,5], 1, 'A4', 80)
    .addNote(6, 2, 'G4', 80);
</script>
```

The script also creates a global `shimiWc` object, holding the same exports as the npm package.


## Documentation

All components have been well documented using storybook, with interactive examples available here: https://jamescoyle1989.github.io/shimi-wc/