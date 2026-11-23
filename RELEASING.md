# Releasing Select2

This document describes the release process for Select2, based on the
4.1.0 and 4.1.1 releases.

## 1. Prepare the release branch

1. Make sure `develop` is up to date:

    ```sh
    git checkout develop
    git pull origin develop
    ```

1. Cut a new release branch from `develop`:

    ```sh
    git checkout -b release/X.Y.Z
    ```

## 2. Bump the version

Update the version string from the previous release to `X.Y.Z` in:

- `package.json`
- `package-lock.json` (top-level `version` fields only)
- `component.json`
- `docs/getting-started/installation.md`
- `docs/overrides/main.html`
- `mkdocs.yml`

## 3. Recompile the distributable files

Run the full build so the `dist/` files pick up the new version and any
source changes since the last release:

```sh
npx grunt compile
npx grunt minify
```

## 4. Update the changelog

Add a new `## X.Y.Z` section to `CHANGELOG.md` above the previous
release, grouped into the appropriate categories. Common categories include
`### Breaking changes`, `### New features / improvements`,
`### Bug fixes`, `### Translations`, `### Documentation`, and
`### Miscellaneous`. Include only the sections that apply. Use this
format:

```markdown
## X.Y.Z

### Bug fixes

- Fix unbound `_normalizeItem` crash for AJAX data in strict-mode builds (#6439)
- Retain `aria-label` and `aria-labelledby` attributes from the origin `<select>` element (#6457)

### Documentation

- Migrate documentation from Grav to MkDocs (#6413, #6419)

### Miscellaneous

- Remove the Node engines constraint (#6446)
```

## 5. Run pre-commit

Run the pre-commit hooks and apply any fixes they report:

```sh
pre-commit run --all-files
```

If hooks modify files, stage and commit those changes before proceeding.

## 6. Commit

Create three commits, matching the established release pattern:

1. `Bump version to X.Y.Z`
1. `Recompile dist files for X.Y.Z`
1. `Update CHANGELOG for X.Y.Z release`

## 7. Open the release pull request

1. Push the release branch:

    ```sh
    git push -u origin release/X.Y.Z
    ```

1. Open a pull request from `release/X.Y.Z` into `develop`:

    ```sh
    gh pr create --base develop --head release/X.Y.Z --title "[Release] X.Y.Z"
    ```

1. Monitor the CI checks and fix any failures (including pre-commit.ci
    auto-fixes) until everything passes.

1. Merge the pull request into `develop`.

## 8. Promote `develop` to `master`

1. Open a pull request from `develop` into `master`:

    ```sh
    gh pr create --base master --head develop --title "Release X.Y.Z"
    ```

1. Monitor the CI checks until they pass.

1. Merge the pull request into `master`.

## 9. Publish the GitHub release

Create a draft release against the `master` commit. The release notes
should be based on the changes that were made to the `CHANGELOG.md` for
the given release. Format the notes with `###` headings and `*` bullets,
matching this example:

```markdown
### Bug fixes

* Fix unbound `_normalizeItem` crash for AJAX data in strict-mode builds (#6439)
* Retain `aria-label` and `aria-labelledby` attributes from the origin `<select>` element (#6457)

### Documentation

* Migrate documentation from Grav to MkDocs (#6413, #6419)

### Miscellaneous

* Remove the Node engines constraint (#6446)

----

This release was sponsored in part by many contributors on the [Open Source Collective](https://opencollective.com/select2) and [GitHub Sponsors](https://github.com/kevin-brown).
```

```sh
gh release create X.Y.Z --draft --target master \
  --title "Select2 X.Y.Z" --notes-file <notes-file>
```

Review the draft, then publish it:

```sh
gh release edit X.Y.Z --draft=false
```

## Notes

- All Grunt invocations in CI and release workflows should use `npx grunt`
    so Grunt resolves correctly on newer runners.
- After rebasing the release branch onto an updated `develop`, verify that
    all `dist/` files (especially minified `.min.js` and `.min.css`)
    contain the new version. During conflict resolution, `git checkout   --ours` refers to the base branch, not the release branch, so it may
    restore stale versions of the minified bundles.
- The Markdown files in `docs/` and the changelog are formatted with
    `mdformat`; JavaScript/JSON/CSS files are formatted with Biome. The
    Biome hook excludes Markdown files to avoid conflicting with `mdformat`.
