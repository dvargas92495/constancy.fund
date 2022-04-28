# constancy.fund

## Quick Links

- [🎤 Staging Environment](https://staging.constancy.fund/)
- [🙋 Start contributing](#Contributing)
- [🎯 Task Board](https://www.notion.so/Team-Dashboard-5d9ccc54b63c42b6a2c03bbf652e0d3e)
- [🐞 Report a Bug](https://github.com/dvargas92495/constancy.fund/issues/new)

## Contributing

1. Assign yourself to the task on Notion and mark the task as "In Progress".
1. Make changes locally to a new branch
1. Push and create a pull request against the main repo
1. Tag the relevant maintainers for review (@dvargas92495)
1. Once approved, merge your pull request and delete the branch

## Environments

There are three main environments that are managed:

- local - Running the app on your machine such that you are the only one with access.
- staging - A test environment deployed to `https://staging.constancy.fund` used by the team to have a shared live instance to give feedback on. Third party services that support test environments like Clerk and Eversign share the same test environment between local and staging.
- production - The live environment used by users, deployed to `https://constancy.fund`. Changes to this branch and data found on it should be considered sacred.

Every change causes a new staging deploy when merged into main. For production, only the relevant infrastructure is redeployed.

## Architecture

The application is built using `[remix](https://remix.run)` and deployed to `[AWS](https://aws.amazon.com)`. To help with all necessary build and deploy tools, the project uses a wrapper on these frameworks called `[fuego](https://github.com/dvargas92495/fuegojs)`, a tool actively in development by @dvargas92495. This should be no cause for concern though, as Remix and AWS are doing all of the heavy lifting.

The Cloud architecture is serverless. There is a Cloudfront CDN that has an Origin Lambda attached which is where the app logic gets deployed to. RDS hosts the mysql data and S3 hosts all of the static content.

## Setup

The project is made up of the following top level directories, representing different deploy targets:

1. `/api` - Has all the functions that make up our public api, deployed to individual Lambdas with API Gateway on top.
1. `/app` - Has all of the application's logic, deployed to our CDN.
1. `/migrations` - Has all data migrations we've ever run locally and on production.

The application's logic is all contained within the `/app` directory. This directory is further subdivided by the following directories:

1. `/_common` - This store common frontend components used across pages.
1. `/data` - This stores all of our backend logic.
1. `/emails` - This stores our email templates.
1. `/enums` - This stores all hardcoded data.
1. `/external` - Third party scripts that we are integrating directly instead of loading in the script tag.
1. `/routes` - This stores all of our frontend pages mapped to URL routes.
1. `/util` - Functions that are used on both the front end and the backend

The rest of the files here are part of Remix's boilerplate. There are three additional directories that should rarely see changes:

1. `/.github/workflows` - This hosts automations for common development workflows
1. `/public` - This hosts public assets like images, favicon, etc.
1. `/server` - This hosts a file used by [Remix](https://remix.run) to run the front end, to be abstracted out in the future.

The rest of the files in the root should be considered boilerplate that helps run the app in all environments.

### Running the app locally

Please follow the steps below to set up the web app locally:

1. Fork the repo to your account.
1. Clone the repo from your github to your local machine.
1. Install dependencies with `npm install`
1. Copy `.env.default` to `.env` file, replacing any secret values that are currently set to `{REPLACE_ME}`. You may want a local mysql database running for the `DATABASE_URL`, otherwise you could connect to staging.
1. Run the app with `npm start`.

This runs both the front end and the back end locally so you could connect to them from your browser at `http://localhost:3000`. If you'd like to run just one of either the front end or the back end, you can run:

1. `npm run dev` - Runs the front end
1. `npm run api` - Runs the back end

### Front End

When looking to make edits to a file, the best place to start is to go to the file in `/routes` the matches the path in the URL. From there, you could inspect elements to find the matching JSX elements in the file.

The project is built on [Styled](https://https://styled-components.com). There are some built on top of [Material UI](https://mui.com), but we are currently migrating away from those components due to performance concerns, both in developer and user experience.

### Back End

Each route has `loader`s and `action`s which call imported modules from `app/data`. This allows Remix to handle both the frontend and backend of our application. Locally, the whole application is served from an Express server. In Production and Staging, the application is deployed as a Lambda Function deployed globally to the edge.

### Database

The application currently uses `mysql` as its database layer. There is an [RDS](https://aws.amazon.com/rds/) instance live for production and staging. For local environment, the developer is expected to run their own instance or connect to staging.

To create a new migration file, run `npx fuego migrate --generate [name]`. To migrate your local data environment, run `npx fuego migrate`.