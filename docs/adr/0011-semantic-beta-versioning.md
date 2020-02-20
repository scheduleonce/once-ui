# 11. semantic beta versioning

Date: 2019-11-18

## Status

Accepted

## Context

We have some issues with the versioning because sometimes the code updated regardless of the fix version in the once-ui library. So for this we used the beta versioning mechanism.

## Decision

- In beta versioning mechanism we publish the prerelease version only for the team environment for testing purpose that would be from the once-ui QA branch and all the release version will be updated in the Master branch of once-ui library.

## Consequences

Prerelease version should not be in the QA and master branch otherwise the code will be updated regardless fix versions.
