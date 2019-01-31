# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.6] - 2019-01-30

### Added

NA

### Changed

- NA

### Removed

- NA

### Fixed

- Fixed button ui [ONCEHUB-4770](https://scheduleonce.atlassian.net/browse/ONCEHUB-4770)

## [1.8.5] - 2019-01-25

### Added

NA

### Changed

- NA

### Removed

- NA

### Fixed

- Hover state for `oui-icon-button`
- Storybook updated for icon-button

## [1.8.4] - 2019-01-23

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- Fixed radio button ui [oncehub-4412](https://scheduleonce.atlassian.net/browse/ONCEHUB-4412)
- Fixed progress button disabled state issue after `setToDone` event call

## [1.8.3] - 2019-01-22

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- Icon size will be taken from the svg in Icomoon dynamically
- User will be able to supply a size property for overriding the size
- Allow passing size input along with the icon moon directive [oncehub-4394](https://scheduleonce.atlassian.net/browse/ONCEHUB-4394)

## [1.8.2] - 2019-01-17

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- Fixed dialog overlay disposal on browser back event [oncehub-4396](https://scheduleonce.atlassian.net/browse/ONCEHUB-4396)

## [1.8.1] - 2019-01-16

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- Fixed tslint issues from once ui project
- Removed unused code from the project

## [1.8.0] - 2019-01-16

### Added

- [`oui-radio-button`](projects/ui/src/lib/oui/radio/README.md)
- [`oui-progress-bar`](projects/ui/src/lib/oui/progress-bar/README.md)

### Changed

- NA

### Removed

- NA

### Fixed

- NA

## [1.7.1] - 2019-01-14

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- [ONCEHUB-1675](https://scheduleonce.atlassian.net/browse/ONCEHUB-1675) - Fixes [once-dropdown](https://github.com/scheduleonce/once-ui/blob/master/projects/ui/src/lib/drop-down/README.md) selectedOption issue if 0 (Zero) is passed to be selected ([@dinesh-rawat](https://github.com/scheduleonce/once-ui/pull/323))

## [1.7.0] - 2019-01-11

### Added

- [`oui-progress-spinner`](projects/ui/src/lib/oui/progress-spinner/README.md)

### Changed

- NA

### Removed

- NA

### Fixed

- NA

## [1.6.2] - 2019-01-10

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- [ONCEHUB-3942](https://scheduleonce.atlassian.net/browse/ONCEHUB-3942) - Styling changes to input and textarea fields ([@so-kushal](https://github.com/scheduleonce/once-ui/pull/318/files))

## [1.6.1] - 2019-01-10

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- Updated all the project dependencies for @once/ui project (@dinesh-rawat)

## [1.6.0] - 2019-01-09

### Added

- [oui-tooltip](projects/ui/src/lib/oui/tooltip/README.md) (@garvit-rajput)

### Changed

- NA

### Removed

- NA

### Fixed

- NA

## [1.5.5] - 2019-01-08

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- [ONCEHUB-3457](https://scheduleonce.atlassian.net/browse/ONCEHUB-3457) - Fixed save, discard button disable issue after submitting form

## [1.5.4] - 2019-01-08

### Added

- NA

### Changed

- `oui-icon` - Make SVG title hidden (Problem only on latest chrome windows browser)

### Removed

- NA

## [1.5.3] - 2019-01-08

### Added

- NA

### Changed

- NA

### Removed

- NA

### Fixed

- [ONCEHUB-588](https://scheduleonce.atlassian.net/browse/ONCEHUB-558) - Fixed an issue with the [old tooltip](projects/ui/src/lib/tooltip/README.md) getting stuck between screens

## [1.5.2] - 2019-01-07

### Added

- NA

### Changed

- Improved styling of [Autocomplete](projects/ui/src/lib/oui/autocomplete/README.md) after Graphic QA
- Improved [Textarea](projects/ui/src/lib/oui/input/README.md) styling after Graphic QA

### Removed

- NA

### Fixed

- NA

## [1.5.1] - 2019-01-07

### Added

- [`oui-checkbox`](projects/ui/src/lib/oui/checkbox/README.md) (@dinesh-rawat)

### Changed

- NA

### Removed

- NA

### Fixed

- NA

## [1.5.0] - 2019-01-04

### Added

- [`oui-slide-toggle`](projects/ui/src/lib/oui/slide-toggle/README.md) (@garvit-rajput)

### Changed

- NA

### Removed

- NA

### Fixed

- NA

## [1.4.2] - 2019-01-04

### Added

- NA

### Changed

- Autocomplete, input, textarea theme improved according to Oncehub (@somanwal)

### Removed

- NA

### Fixed

- Autocomplete, input, textarea theme improved according to Oncehub
- Removed overriding css of CDK from Autocomplete (@somanwal)

## [1.4.0] - 2019-01-02

### Added

- [`oui-icon`](projects/ui/src/lib/oui/icon/README.md) (@dinesh-rawat)
- [`oui-menu`](projects/ui/src/lib/oui/menu/README.md) (@TheVikash)
- [`oui-icon-button`](projects/ui/src/lib/oui/button/README.md) with oui-icon support (@TheVikash)

### Changed

- `oui-icon-button` renamed to `oui-icon-text-button`

### Removed

- NA

### Fixed

- cdk overlay bug fixes

* https://github.com/scheduleonce/once-ui/blob/master/projects/ui/src/lib/oui/autocomplete/README.md, https://github.com/scheduleonce/once-ui/blob/master/projects/ui/src/lib/oui/input/README.md
