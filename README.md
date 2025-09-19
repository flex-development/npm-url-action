# npm-url

[![github release](https://img.shields.io/github/v/release/flex-development/npm-url-action.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/npm-url-action/releases/latest)
[![test](https://github.com/flex-development/npm-url-action/actions/workflows/test.yml/badge.svg)](https://github.com/flex-development/npm-url-action/actions/workflows/test.yml)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/npm-url-action.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits\&logoColor=ffffff)](https://conventionalcommits.org)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

Create a URL for the NPM registry

## Contents

- [What is this?](#what-is-this)
- [Use](#use)
- [Inputs](#inputs)
  - [`pkg`](#pkg)
  - [`scope`](#scope)
  - [`version`](#version)
- [Outputs](#outputs)
  - [`url`](#url)
- [Contribute](#contribute)

## What is this?

This is a simple action for creating NPM registry URLs.

## Use

```yaml
---
name: publish
on:
  release:
    types:
      - published
jobs:
  preflight:
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.environment.outputs.url }}
      version: ${{ steps.version.outputs.manifest }}
    steps:
      - id: checkout
        name: Checkout ${{ github.ref_name }}
        uses: actions/checkout@v5.0.0
        with:
          persist-credentials: false
          ref: ${{ github.ref }}
      - id: version
        name: Get package version
        uses: flex-development/manver-action@1.0.1
      - id: environment
        name: Get environment url
        uses: flex-development/npm-url-action@1.0.0
        with:
          scope: ${{ github.repository_owner }}
          version: ${{ steps.version.outputs.manifest }}
  npm:
    needs: preflight
    permissions:
      contents: read
      id-token: write
      packages: write
    runs-on: ubuntu-latest
    environment:
      name: npm
      url: ${{ needs.preflight.outputs.environment }}
    steps:
      - id: npmrc
        name: Setup .npmrc file
        uses: actions/setup-node@v5.0.0
        with:
          always-auth: true
          registry-url: https://registry.npmjs.org
          scope: ${{ github.repository_owner }}
      - id: dist-tag
        name: Get dist tag
        uses: flex-development/dist-tag-action@1.1.2
        with:
          target: ${{ needs.preflight.outputs.version }}
      - id: publish
        name: Publish package
        env:
          ARTIFACT: ${{ github.event.release.assets[0].browser_download_url }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npm publish --provenance ${{ steps.dist-tag.outputs.flag }} $ARTIFACT
```

## Inputs

### `pkg`

> **default**: `${{ github.event.repository.name }}`

The name of the package.

### `scope`

The scope of the [package](#pkg).

### `version`

The version of the [package](#pkg) to include in the URL.

## Outputs

### `url`

The public registry URL.

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.
