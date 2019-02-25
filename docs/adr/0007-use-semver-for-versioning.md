# 7. Use semver for versioning

Date: 2018-12-21

## Status

Accepted

## Context

We need a versioning scheme for our project.

## Decision

- We will use [semver](https://semver.org/) which is the most prevalent versioning scheme for node.js libraries and is easy to use.
- We will follow the rules of updating `MAJOR.MINOR.PATCH` version numbers and their semantic meaning.

## Consequences

Common language for anyone using the project. They know exactly how the changes in the new version will affect their code.
