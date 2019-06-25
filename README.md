# SELECT 2

This branch represents work-in-progress for the next (5.x) version of Select2.

Major features of this branch:

## ADA support

ADA support has been lacking in previous versions of Select2 which made it difficult in incorporate into applications
where ADA is a requirement. In order to support ADA Select2 had to be redesigned from scratch.

## Written in Preact

This version of Select2 is written in Preact. The reason behind this decision is that majority of bugs came from
state updates being inconsistently applied to the DOM, by using Preact we get DOM updates for free.

## Native Bridge / Usage Outside Preact

The fact that the core component is written in Preact does not preclude the usage of Select2 in other environments. To
this end `select25.js` is provided and allows usage of the widget via native JavaScript.

## TODO

-   So far this branch contains prototype implementations of the Multi-Select and Single-Select widgets. This branch will act as a proof of
    concept. Once ADA compliance has been validated by the community the rest of the features will follow.

-   The visual design / initial theme is still incomplete

-   Mobile design and testing

## Building

`npm run dist`

## Developing

`npm run dev` and open `http://localhost:1234`.
Sources for dev playground are in `./dev/`

## Reporting Bugs

Please tag GitHub issues and other threads using the `5.x` label

## Copyright and License

The license is available within the repository in the LICENSE file.
