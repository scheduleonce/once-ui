# 10. add keyboard accessibility

Date: 2019-11-11

## Status

Accepted

## Context

We have to provide the accessibility feature in the application. Right now most of the places we are using the once-ui components so we won't be able to access the application through the keyboard. So for this we need to enhance the accessibility in the application.

## Decision

- We are adding the cdk focus monitor in all the components to enhances the accessibility which it self managing all the focus states.

## Consequences

If we will not enhance the accessibility the user will not be able to navigate through the TAB key to interactive elements on a web page and also as a keyboard user, the order in which items receives focus is important.
