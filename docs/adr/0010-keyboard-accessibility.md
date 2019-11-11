# 10. keyboard accessibility

Date: 2019-11-11

## Status

Accepted

## Context

We have to provide the accessibility feature in the application. Right now most of the places we are using the once-ui components so we won't be able to access the application through the keyboard. So for this we need to enhance the accessibility in the application. We have some issues with the versioning because sometimes the code updated regardless of the fix version in the once-ui library. So for this we used the beta versioning mechanism.

## Decision

We are adding the cdk focus monitor in all the components to enhances the accessibility which it self managing all the focus states. In beta versioning mechanism we publish the prerelease version only for the team environment for testing purpose that would be from the once-ui QA branch and all the release version will be updated in the Master branch of once-ui library.

## Consequences

If we will not use this version then all the once-ui components will not be accessible by keyboard. Prerelease version should not be in the QA and master branch otherwise the code will be updated regardless fix versions.
