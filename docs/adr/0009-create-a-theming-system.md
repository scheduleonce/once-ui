# 9. Create a theming system

Date: 2018-12-21

## Status

Accepted

## Context

Multiple applications are going to use the ui components, each one with slightly different theme (color). We need the library to be flexible enough to support such themes.

## Decision

- We'll create a theming system based exactly on how Angular Material does themes.
- Users will be able to override theme for specific component instance if really needed.

## Consequences

Components are easily adjusted to fit the theme of the projects they are used in.
