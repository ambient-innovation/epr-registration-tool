# EPR Registration Tool

## Links

- Repo: [GitLab](https://gitlab.ambient-innovation.com/giz/epr-registration-tool)
- Designs: [Figma](https://www.figma.com/file/rMPctW2clyHO78B6AYGTTH/GIZ)
- Test Server (Backend): [api.epr-test.ambient.digital](api.epr-test.ambient.digital)
- Test Server (Frontend): [epr-test.ambient.digital](epr-test.ambient.digital)


## Project Structure

### [`/backend/README.md`](./backend/README.md)

### [`/frontend/README.md`](./frontend/README.md)


## pre-push hooks

Git pre push hooks for Backend and Frontend are in [`.pre-commit-config`](./.pre-commit-config.yaml)
to activate it run in the project root dir.

    pre-commit install --hook-type pre-push

You may need to install pre-commit if not already installed

    pip install pre-commit
    brew install pre-commit     (mac alternative)


## Glossary

* **[EPR](https://www.zmart.de/blog/epr-was-ist-die-erweiterte-herstellerverantwortung)**  
  extended producer responsibility
  (erweiterte Herstellerverantwortung)  
