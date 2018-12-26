# 6. Keep the api surface as minimal as possible

Date: 2018-12-21

## Status

Accepted

## Context

Since many developers are going to use this library for many different features, we need to have some rules of thumb for what goes into the component and what does not go.

## Decision

- We will choose to keep the api surface as minimal as possible, adding only the most necessary features in.
- We will prefer leaving some features to the user of the library.
- If we are not sure about something, it's better to leave it out and wait before we make the decision to add it.

## Consequences

- It's relatively easy to add something later in a non breaking way, but removing something out of the api always means breaking backwards compatibility and is harder.
- Leaving features out also means that it gives us more time to see how the component is actually being used and decided if that feature is actually needed.
- By deferring some features to the user of the library means that the user might need to write more code to use the component. But the user can write higher order components that use the underlying components from this library. These higher order components can then be reused as well in the user's application.
- Code is smaller, less bloated and easier to maintain and test.
