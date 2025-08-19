# Code Challenge: Capital Gains

Solution for the Capital Gains.

[Statement](./spec-enus.pdf)

## Design decisions

The application logic was solved using Functional Programming. The folder structure and app design was based on the Hexagonal Architecture style, where the `application` folder contains the domain/business logic and the ports (interface contracts) definitions that the driver side (implemented in the infrastructure folder). This way we achieve a proper **separation of concerns**, **domain isolation**, **dependency inversion**. All these feature improve the **testability** and **extensibility** of the system, given its logic changes or the client side needs to change.

## Project initialization

This CLI was developed using TypeScript, npm as dependency manager and Node.js LTS as runtime environment.

- Project initiated via `$ docker run -it --rm -v "$(pwd):/app" node:22 /bin/bash -c "cd /app && npm init"`

## Development

**Using Docker:**

- Run development container: `$ docker run --name capital-gains -it --rm -v "$(pwd):/app" -p 9229:9229 node:22 /bin/bash`
- change directory into `app/`: `cd app/`
- Run tests: `npm run test:debug -- tests/`

### Debug tests

From VSCode/Cursor:

- Launch "Attach to Docker Node"
- Run test inside container: `npm run test:debug -- <path-to-file-under-test>`

## CLI Execution

- Build Image: `$ docker build -t capital-gains -f Dockerfile.prod .`
- Run: `$ cat <operations-file.txt> | docker run --rm -i capital-gains`

  or: `$ docker run --rm -i capital-gains < <operations-file.txt>`
