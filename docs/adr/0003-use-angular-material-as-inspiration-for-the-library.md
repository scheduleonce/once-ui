# 3. Use Angular Material as inspiration for the library

Date: 2018-12-21

## Status

Accepted

## Context

Since we do not have the expertise and experience needed to build ui library projects and since we cannot fully anticipate the future needs of such library it's best to follow the path of other libraries and implement it in a similar way.

## Decision

- We will copy the (api) design of Angular Material - Angular Material is created and maintained by the Angular team and is a very popular library. It is well tested and very well designed and most importantly has been used by many other teams already. It makes sense to copy their api design and features.
- We will try to stay as close as possible to the same design approach chosen by Angular Material for each component.
- We will only copy features that we need, we will not implement features we do not need like the ripple effects or support for bidirectionality.
- We will not copy paste the code as is without understanding it, we will first study it carefully and then borrow what we need from it.
- We will use the CDK as much as possible.

## Consequences

- We leverage the work of teams that are experts in Angular to create high quality components for our own use.
- We learn new things about good Angular design patterns.
- We have components that are generic enough to account for future use cases - The Angular team has much bigger developer audience so most chances are that they've already encountered many use cases.
