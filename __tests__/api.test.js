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

describe("GET /api/notapath", () => {
  test("returns a 404 error when given a path which doesn't exist", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path does not exist");
      });
  });
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
  test("Returns a status of 200 all key-value pairs inc comment_count", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review.hasOwnProperty("comment_count")).toBe(true);
        expect(review.comment_count).toBe(0);
      });
  });
  test("Returns a status of 404 when given id which doesn't exist", () => {
    return request(app)
      .get("/api/reviews/67")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a status of 400 when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("returns status 200 and an object", () => {
    const updateVotes = { inc_votes: 10 };
    const returnObj = {
      review_id: 1,
      title: "Agricola",
      category: "euro game",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_body: "Farmyard fun!",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 11,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: updatedReview }) => {
        expect(updatedReview).toEqual(returnObj);
      });
  });
  test("returns status 200 and a review object with votes property incremented by 10", () => {
    const updateVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: updatedReview }) => {
        expect(updatedReview.votes).toBe(11);
      });
  });
  test("returns status 200 and a review object with votes property decremented by 100 when passed a negative number", () => {
    const updateVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: updatedReview }) => {
        expect(updatedReview.votes).toBe(-9);
      });
  });
  test("Returns a status of 404 when given id which doesn't exist", () => {
    const updateVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/67")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a status of 400 when given an invalid id", () => {
    const updateVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/invalid_id")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Returns a status of 400 when given a malformed body/missing fields/incorrect type", () => {
    const updateVotes = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("returns a status of 200 and an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
      });
  });
  test("returns an array of user objects with correct key-value pairs", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user.username).toEqual(expect.any(String));
          expect(user.name).toEqual(expect.any(String));
          expect(user.avatar_url).toEqual(expect.any(String));
        });
      });
  });
});
