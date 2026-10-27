# ALICE-ETHZ-AREMA Contributing Guide

Hi! Thanks for taking the time to contribute to ALICE-ETHZ-AREMA.

_You can contribute in many ways_

- Join the [discussion](https://github.com/EPFL-ENAC/ALICE-ETHZ-AREMA/discussions)

_Before submitting your contribution, please make sure to take a moment and read through the following guidelines_

- [Code of Conduct](https://github.com/EPFL-ENAC/ALICE-ETHZ-AREMA/blob/main/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Commit Messages](#commit-messages)

## Issue Reporting Guidelines

- Always use [issue templates](https://github.com/EPFL-ENAC/ALICE-ETHZ-AREMA/issues/new/choose)
- If you don't find a corresponding issue template please use the template to ask a new template

## Pull Request Guidelines

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests. All code changes happen through pull requests ([GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)).

### Timeline example

1. Create an issue (fix/feature/etc..)
2. Create a branch from the issue (the issue number will directly be in the branch name)
   - the issue's title should be what you expect your branch name to be
3. Checkout locally, push commits to GitHub
4. Create a pull request from the branch, targeting `dev`, and link the issue
5. Merge the pull request
   - Replace the GitHub automatic merge commit message (e.g. `Merge pull request #3 from EPFL-ENAC/2-bug-...`) by a [conventional commit](#commit-messages) message; usually a copy/paste of the pull request title is enough
6. The issue is auto-closed

### Branches

- The `main` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `main` branch.**
- Checkout a topic branch from `dev`, and merge back against `dev`.
- Pushes to `dev` are deployed automatically; releases are deployed from `v*.*.*` tags.

### Recommendation for the pull request

- Add screenshots or GIFs for any UI changes. This will help the person reviewing your code to understand what you’ve changed and how it works.
- Make sure the description has at least:
  - the user problem you are solving;
  - acceptance criteria of the ticket;
  - testing you have done or plan to do before release;
  - any pull request that are dependent on this one, or any tickets on which this pull request depends.
- Make sure the tests pass and the code lints (see [Development Setup](#development-setup)).
- **DO NOT** check in build output (`dist`) in the commits.
- It's OK to have multiple small commits as you work on the PR.
- If you've changed APIs or added a breaking change, update the documentation and notify the users.
- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.
  - Present your issue in the 'discussion' part of this repo
- If fixing a bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

### Code review checklist

- Ask to people to review your code:
  - a person who knows the domain well and can spot bugs in the business logic;
  - an expert in the technologies you’re using who can help you improve the code quality.
- When you’re done with the changes after a code review, do another self review of the code and write a comment to notify the reviewer, that the pull request is ready for another iteration.
- Review all the review comments and make sure they are all addressed before the next review iteration.
- Make sure you don’t have similar issues anywhere else in your pull request.
- If you’re not going to follow any of the code review recommendations, please add a comment explaining why.
- Avoid writing comment like "done" of "fixed" on each code review comment. Reviewers assume you’ll do all suggested changes, unless you have a reason not to do some of them.
- Sometimes it’s okay to postpone changes — in this case you’ll need to add a ticket number to the pull request and to the code itself.

## Coding Standards

Setup your editor to have immediate feedback on your changes:

- [ESLint plugin](https://eslint.org/docs/latest/use/integrations)
- [Prettier plugin](https://prettier.io/docs/en/editors.html)
- TypeScript support

### TypeScript / Vue

- Code passes ESLint and is formatted with Prettier (`npm run lint` and `npm run format` in `frontend` and `admin`).

### HTML

- All code is [WCAG Level AA](https://www.w3.org/WAI/WCAG22/quickref/) compliant.
  - _See [tools and techniques to use to test accessibility](https://daverupert.com/2018/07/assistive-technologies-i-test-with/)._
- Semantic tags are used where possible instead of `div`s and `span`s (headings, paragraphs, lists, etc.)
- All interactive elements (links, buttons, form elements) are keyboard accessible and have visible focus states.
- Tab order of all interactive elements follows a logical pattern, usually their position on the screen and order in the DOM.
- All non-standard elements have appropriate ARIA roles.
- All interactive elements have accessible labels.
- All non-text content has a text alternative.
  - _For example, images have appropriate alt texts, clickable icons have titles, and videos have captions._
- UI looks good on any screen size (mobile, desktop, etc.).
- UI looks good with 200% page zoom.

### CSS

- No hardcoded colors, font sizes, whitespace, breakpoints and z-indices.
  - _Always use Quasar variables and classes instead._
- No style overrides of any component library components.
- No unnecessary CSS, ideally there’s no CSS at all.
  - _For example, prefer Quasar components and utility classes instead of custom styles._
- Try to use rem and em instead of px:
  - Border width (px) - Relative border width is ugly.
  - Icon size (rem) - When inline with text.
  - Margin for typography (rem) - Case for margin between heading and paragraph.
  - Padding for typography (em) - Case for different button size.
  - Font size (rem) - Case for heading font size and secondary font size. (em is not recommended)
  - Root font size (px) - It is the root! Why bother with relative units? Relative to what??
  - Line height (rem) - Because it needs to be relative to the font size. Unless you want to set a vertical rhythm and such.

### Python

- Code passes [Ruff](https://docs.astral.sh/ruff/) linting and formatting (`make lint` in `backend`, `make format` to auto-fix).
- We follow [PEP 8](https://peps.python.org/pep-0008/) and the [python-guide writing style](https://docs.python-guide.org/writing/style/).

## Development Setup

You will need:

- [Node.js](https://nodejs.org) (>= 22.22) and npm
- [uv](https://docs.astral.sh/uv/) (Python >= 3.11)
- Docker and GNU Make

From the repository root:

```bash
cp .env.example .env            # then fill in the secrets
make run                       # start PostgreSQL and Elasticsearch (see `make help`)

cd backend
make install                   # install the dependencies
make db-upgrade                # apply the database migrations
make run                       # start the API on http://localhost:8000
make test                      # run the tests
make lint                      # check linting and formatting (ruff)
make format                    # auto-fix linting and format the code

cd admin                       # or frontend
npm install
npm run dev                    # start the development server
npm run lint
```

## Project Structure

- **`backend`**: REST API, written in Python with FastAPI, SQLAlchemy (PostgreSQL, Alembic migrations) and Elasticsearch.
- **`admin`**: back-office application to edit and publish the content (draft data stored in PostgreSQL). Vue 3, TypeScript, Quasar and Pinia.
- **`frontend`**: public map application (published data indexed in Elasticsearch). Vue 3, TypeScript, Quasar and Pinia.
- **`migration`**: data migration and backup material.
- **`data`**: geographic data (QGIS project, map style).

## Financial Contribution

We also welcome financial contributions. Please contact us directly.

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) convention to have consistent git messages, e.g. `feat(admin): ...`, `fix(backend): ...`, `chore(deps): ...`. The goal is to increase readability and ease of contribution.

## Credits

Thank you to all the people who have already contributed to ALICE-ETHZ-AREMA repository!
