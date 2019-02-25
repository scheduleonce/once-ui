# 2. Build a high quality ui components library

Date: 2018-12-21

## Status

Accepted

## Context

Moving towards a suite of multiple applications, we need a library of shared Angular components that can be reused across the different apps, all with the same design language and a consistent api.

## Decision

- We will build a library of atomic ui components that will be used throughout the applications.
- Developers should be able to easily import only the components they need and use them in their applications.
- Components should be well tested and isolated in a way that doesn't break the host application's code.

## Consequences

- Developers would easily incorporate the library in their applications and use whatever components they need.
- We will reuse the same components throughout our applications and avoid the practice of each team creating their own ad-hoc components for the purpose of a specific feature.
- More reusability means less bugs or at least less places to look for bugs.
