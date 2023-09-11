# 🚧 This is a work in progress

If you'd like to be part of the development of this app, kindly follow the instructions below. If you have any further questions or would like to get involved, [get in touch with Firgrep here](https://www.filipniklas.com/#/contact).

## Setting up your local environment and branch

0.0. Once you have access to the repo on github, fork and/or clone it into a folder where you keep your projects.

0.1. Then `cd symposia` to get into the project directory.

0.2. Make your own development branch `git branch dev-<your-name>` (example: `git branch dev-tim`).

0.3. Set the newly made development branch as the current active branch, run `git checkout <your-branch-name>`.

0.4. In future, when getting the latest changes from the main development branch, run `git merge dev` whilst on your development branch to incorporate the changes into your branch. 

### Packages Installation
1.0. Once inside, run `npm i` (alias `npm install`) to install all the packages. This will create the `/node_modules` folder.

### Environmental Variables
2.0. After installation, run `touch .env` (or `ni .env` if you use Powershell or some windowsy thing).

2.1. Then, run `cp env.example .env` to copy the example env file. 

2.2. Open the newly created `.env` file and check that it's populated. Ask Filip/Firgrep directly for the missing values.

### Setting Up Local Prisma Client
3.0. Run `npx prisma generate` to generate the prisma client, this will be important for keeping your local types up to date with the database schema.

### Running the Server
9.9. Finally, to start a local development server, run `npm run dev` and open up `http://localhost:3000` on your favorite browser.

- Whenever you make any edits to the source files while the server is running, the server will pick up those changes and output them immediately. This is extremely handy during development, as you can input code and hit `ctrl` + `k` then `s` (save-all) and view directly your latest changes.
- To terminate the server, hit `ctrl` + `c` on your keyboard whilst in the terminal where the server runs, input `y` when prompted to terminate batch job.

## NextJS Client-Server Model

A high-level abstraction of the relationship between Client- and Server Components and how they interact with the backend. (Subject to change.)

<img src="https://firebasestorage.googleapis.com/v0/b/portfolio-d0330.appspot.com/o/symposia-static%2Fnextjs-server-client-pattern.png?alt=media&token=23699e9b-c995-4a9e-8ec0-a6f0356a4cba" alt="nextjs-client-server-model"/>

## File Structure

```
/
├───logs
├───prisma
├───public
|   └───static
|
├───src
|   ├───app
|   |   ├───(admin)
|   |   ├───(user)
|   |   ├───api
|   |   |   ├───auth
|   |   |   └───trpc
|   |   |   error.tsx
|   |   |   favicon.ico
|   |   |   globals.css
|   |   |   page.tsx
|   |
|   ├───components
|   |
|   ├───config
|   |
|   ├───lib
|   |
|   ├───server
|   |   ├───api
|   |   |   ├───routers
|   |   |   |   routersRoot.ts
|   |   |   |   trpc.ts
|   |   |
|   |   ├───controllers
|   |   |   auth.ts
|   |   |   db.ts
|   |
|   └───utils
|
|   .env
|   .env.example

```

## Explanation
- `/` Project root directory.
- `logs` Various text and resources directory.
- `prisma` Prisma directory, holds the `.prisma` schema database models. **This is the source of truth for all data.** Through the Prisma Client, the application gains type-safety of the db models.
- `public/*` Any public static content or resources (images, videos, etc) for the app.
- `src` Main source code directory.
- `app` Specialized next.js "app router" directory. Creates routes based on directory name. E.g. `app/editor/page.tsx` equals to `https://webapp.com/editor` in the browser.
    - `(directory)` Skips routing mechanism. This is useful if we want to group several routes under a common idea.
    - `_directory` Also will be ignored by the router (and sub-directories as well)
    - `directory` Any directories and sub-directories under the `app/` will be made into a route insofar as it contains a `page.tsx` file
    - `api` Special directory for API endpoints
        - `auth/*` Endpoint for nextAuth authentication
        - `trpc/*` Endpoint for TypeScript Remote Procedure Call, allowing for the front end to make calls to the server for data
    - `error.tsx` Special next.js error file that is displayed whenever there is an error (is only superseeded by other `error.tsx` nested closer to the point of error origin)
    - `globals.css` Root CSS config file. 
    - `layout.tsx` Special next.js layout file. Anything put here will "trickle down" into any sub-directories. Extremely useful for application-wide logic. Next.js also allows us to make nested layout files that will affect any sub-directories below then, such that we can e.g. have one application-wide general layout and another nested layout for admin related matters or one for user related matters.
    - `page.tsx` The entry-point for the route. In the next.js app router (which is what we're using), in contrast to the pages router, **all page** files are React Server Components, which means that they are non-interactive React components but with direct access to the server (no need for an API). For any clientside interactivity (typical React components), these need to be imported and outputted as part the pages/Server Component's return.
- `components` Home of (most) React components, both client and server, seperated into sub-folders by concern when necessary.
- `config` Various application-wide configuration files.
- `lib` When particular configuration is needed with certain libraries, such as generating clients and making React context providers, this is the directory for that.
    - `nextAuth` Clientside configuration for nextAuth.
    - `trpc` Clientside configuration for tRPC.
- `server` Main directory for all pure serverside matters.
    - `api` Serverside entry-point for api calls, specifically related to tRPC.
        - `routers` Routers directory for tRPC (similar to Express.js routers).
        - `routersRoot.ts` Any routers in the `routers/` directory must be registered here.
        - `trpc.ts` tRPC configuration file.
    - `controllers` Directory for pure backend functions. **Only these are allowed to interact with the database.** Any Server Components/pages.tsx that want to interact with the database must go through these, and any Client Components must first pass via tRPC, which in turn calls these functions. The idea is that we group together all backend work in one place, that way we won't do double work when we have the same operation that needs to be done by both Client- and Server Components.
    - `auth.ts` nextAuth configuration file.
    - `db.ts` Prisma Client configuration file.
- `utils` Application-wide utility functions directory.
- `.env` **DO NOT COMMIT TO GIT** Environenmental variables. If the requisite variables are not populated, parts of the app won't work.
- `.env.example` Example file of `.env` but without sensitive values.
- `package.json` Top-level dependencies and configurations of the project.