# File Structure

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