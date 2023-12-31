# Setting up your local environment and branch

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
