# 8. Run the code in continuous integration server

Date: 2018-12-21

## Status

Accepted

## Context

In addition to writing tests for each component, we need to run these tests continuously.

## Decision

We will use Jenkins to run all the tests in the project and also run linter and Prettier.

## Consequences

We have a good checks in place to make sure we are not breaking the code and we can notice in time if something goes wrong.
