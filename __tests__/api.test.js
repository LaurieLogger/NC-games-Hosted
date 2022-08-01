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

describe("GET /api/reviews/:review_id", () => {
  test("returns status of 200 and an object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: review }) => {
        expect(review).toBeInstanceOf(Object);
      });
  });
  test("Returns a status of 200 all key-value pairs", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("Returns a status of 404 when given id which doesn't exist", () => {
    return request(app)
      .get("/api/reviews/67")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error 404: Not found");
      });
  });
  test("Returns a status of 400 when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error 400: Bad request");
      });
  });
});
