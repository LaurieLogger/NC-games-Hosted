const app = require(`${__dirname}/../app.js`);
const request = require("supertest");
const db = require(`${__dirname}/../db`);
const data = require(`${__dirname}/../db/data`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("Returns an array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
      });
  });
  test("Returns a status of 200 and all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toHaveLength(4);
        expect(categories[0]).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
  test("Returns a status of 404 when given path which does not exist", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error 404: Path does not exist");
      });
  });
});
