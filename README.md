# GitHub Actions Jest Reporter

This action allows you to create annotations and coverage reports based on Jest's JSON Output.

## Usage

Extend your GitHub action YAML with this:

```yml
  - name: Jest Report
    if: always()
    uses: RedaktionsNetzwerk-Deutschland/action-jest-reporter@v1.0.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

On the next execution, you can inspect the output in the checks tab within a Pull Request.

## API

This action is not meant to be run programmatically.

## Installation

This action is installed and executed within GitHub.

If you want to adapt it, check [Contribution Guidelines](./CONTRIBUTING.md).

## License

This action is not meant to be published. All rights reserved.
