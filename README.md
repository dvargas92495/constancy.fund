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

## Setup

The project's logic is all contained within the following three directories:

1. `/app` - This hosts the source code for the app's frontend.
1. `/db` - This hosts the data schema and sql migrations used.
1. `/functions` - This hosts all of the API endpoints deployed as serverless functions.

There are three additional directories that should rarely see changes:

1. `/.github/workflows` - This hosts automations for common development workflows
1. `/public` - This hosts public assets like images, favicon, etc.
1. `/server` - This hosts a file used by [Remix](https://remix.run) to run the front end, to be abstracted out in the future.

The rest of the files in the root should be considered boilerplate that helps run the app in all environments.

### Running the app locally

Please follow the steps below to set up the web app locally:

1. Fork the repo to your account
1. Clone the repo from your github to your local machine
1. Install dependencies with `npm install`
1. Copy `.env.default` to `.env` file, replacing any secret values that are currently set to `{REPLACE_ME}`. You may want a local mysql database running for the `DATABASE_URL`.
1. Run the app with `npm start`

This runs both the front end and the back end locally so you could connect to them from your browser at `http://localhost:3000`. If you'd like to run just one of either the front end or the back end, you can run:

1. `npm run dev` - Runs the front end
1. `npm run api` - Runs the back end

### Front End

The front end currently has the following directories:
- `_common` - A set of common components used across multiple pages
- `routes` - The set of URL routes the application exposes. The file names map one to one with the URL path, so the file `about.tsx` is what loads when the user navigates to `/about`.

At the root of the front end directory you'll find boilerplate Remix files that will soon be abstracted out of the repo.

When looking to make edits to a file, the best place to start is to go to the file in `/routes` the matches the path in the URL. From there, you could inspect elements to find the matching JSX elements in the file.

The project is built on top of [Material UI](https://mui.com). Most components that come out of `@dvargas92495/ui` are simply higher level abstractions on Material. I'm not currently sold on using this library long term, and am happy to look for alternatives once we have designs. In any case, styling a MUI component is as easy as adding a `sx` prop on the component of interest, and adding the desired style attributes. 

### Back End

Each file maps directly to an API path in our backend. For example, the `/agreement/delete.ts` file maps to the `DELETE /agreement` API call. 

Locally, all of the functions load up as routes to a local express server running on port 3003. On Staging and Production, each file is bundled and deployed to a separate lambda function, accessible from the `api.` subdomain.

### Database

The application currently uses `mysql` as its database layer. There is an [RDS](https://aws.amazon.com/rds/) instance live for production and staging. For local environment, the developer is expected to run their own instance.

The `/db` directory is broken up into the following sections:
- `schema.prisma` - a file defining the app's data model. When this file changes, `prisma` is able to autogenerate and eventually run migration files to have the target environment match the file's definition. Unfortunately, as an ORM, `prisma` queries were prohibitively expensive and we are currently migrating away from the ORM and SQL queries directly.
- `/fundraise_content` - a data file outlining the data necessary to generate different contracts. When our contract infrastructure becomes more configurable, this is expected to move to its own data store.
- `/migrations` - migration files that run in different environments to set up our live schema.
- `/util` - helper functions that are used by both the front end and back end, usually used to manipulate data. This is expected to move to a different directory.
- Rest of the files in the root - Hardcoded data files.
