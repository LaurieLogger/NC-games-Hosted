# Northcoders House of Games API

- A backend api built on node.js and seeded using PSQL.

  - Database seeded with datasets of boardgames, users, categories, comments and reviews.

  - Separated server routes for ease of maintenance.

  - Fully integrated test-and-deployment workflow performing unit-testing, integrated testing, and deployment on push.

- Database endpoints include:
  - `GET /api/categories`
  - `GET /api/reviews/:review_id`
  - `PATCH /api/reviews/:review_id`
  - `GET /api/users`
  - `GET /api/reviews`
  - `GET /api/reviews/:review_id/comments`
  - `POST /api/reviews/:review_id/comments`
  - `DELETE /api/comments/:comment_id`
- For a full list of endpoints and the currently accepted queries, please use: `GET /api`

**Hosted @ (Heroku):** https://bumble-nc-games.herokuapp.com/

## Setup:

1. Clone repo to local machine: `git clone https://github.com/BumbleGoose/NC-games-Hosted.git`

2. Install packages: `npm i`

3. Add .env files (both test and development) to set PGDATABASE to relevant environment. (eg: .env.test contains: `PGDATABASE=nc_games_test` **&&** .env.development contains: `PGDATABASE=nc_games`)

4. Add .env files to .gitignore

5. Initialise database using script: `npm run setup-dbs`

6. Test suite uses jest: `npm t`
   **Note** Test suite auto-seeds database before each test and provides default listener.

7. To seed in the development environment, run script: `npm run seed`

- **Optional:** Create a parent `index.js` file for /db/data folder to amalgamate `/db/data/development-data/index.js` && `/db/data/test-data/index.js`

### Software versions

- PostgreSQL v. 14.4

- Node v. 18.2.0
