# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


## Unreleased


## 2.0.0 (2026-10-15)

### Changed

- **Breaking:** shimi is now a peer dependency, and must be installed alongside shimi-wc. Lit, shimi & chroma-js are no longer bundled into the npm build, so apps share a single copy of each with the components
- **Breaking:** The package is now ESM only. The CommonJS build has been removed, and the ES module has moved from `dist/index.mjs` to `dist/index.js`. Imports should go through the package name (`import 'shimi-wc'`) rather than file paths
- The unpkg/jsdelivr build is now a script that works from a plain `<script>` tag, using the global `shimi` object

### Added

- TypeScript type declarations
- Component classes & full width strategies are now exported from the package (previous releases exported nothing)
- `HTMLElementTagNameMap` entry for `<chord-progression-editor>`
- Custom elements manifest (`dist/custom-elements.json`) for editor tooling

### Fixed

- `<script>` tag usage from unpkg, which previously failed because the file it served was an ES module


## 1.6.0 (2026-09-13)

### Changed

- Updated shimi dependency to v4


## 1.5.3 (2024-04-10)

### Fixed

- Full width strategies with parameters can now actually be set from consuming code by using string patterns


## 1.5.2 (2024-04-09)

### Fixed

- Exported full width strategies so new instances of them can be created


## 1.5.1 (2024-04-09)

### Fixed

- Prevented ChordProgressionEditor from throwing error if chordProgression property not set


## 1.5.0 (2024-04-09)

### Added

- Support for ClipEditor & ChordProgression editor to set their own full-width strategies


## 1.4.1 (2024-04-08)

### Fixed

- Included ChordProgressionEditor in list of library exports


## 1.4.0 (2024-04-07)

### Added

- ChordProgressionEditor component


## 1.3.1 (2024-01-14)

### Fixed

- Updated project references in attempt to fix breaking storybook site on github


## 1.3.0 (2024-01-14)

### Added

- Clip Editor accepts custom namings of pitches


## 1.2.0 (2023-10-17)

### Added

- Clip editor can add playheads that visually represent the moving position of a ClipPlayer


## 1.1.0 (2023-10-15)

### Added

- Better support for sizing clip editor


## 1.0.0 (2023-09-17)

### Added

- More unit tests


### Added

- Unit tests

### Fixed

- Minor fix to readme link


## 0.1.2 (2023-09-16)

### Fixed

- Improved welcome page on storybook site

- Fixed support for disabling note pitch dragging

- Moved storybook static site from 'storybook-static' to 'docs'

- Improved README


## 0.1.1 (2023-09-15)

### Fixed

- Rebranded project to allow for publishing to npm


## 0.1.0 (2023-09-14)

### Added

- Added out-port-picker & in-port-picker

- Added scale-picker

- Added clip-editor

- Added storybook documentation