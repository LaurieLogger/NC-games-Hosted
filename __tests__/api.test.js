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
describe("GET /api/reviews", () => {
  test("returns a status of 200 and an array of objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
      });
  });
  test("returns an array of review objects with correct key-value pairs inc comment_count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(review.owner).toEqual(expect.any(String));
          expect(review.title).toEqual(expect.any(String));
          expect(review.review_id).toEqual(expect.any(Number));
          expect(review.category).toEqual(expect.any(String));
          expect(review.review_img_url).toEqual(expect.any(String));
          expect(review.created_at).toEqual(expect.any(String));
          expect(review.votes).toEqual(expect.any(Number));
          expect(review.designer).toEqual(expect.any(String));
          expect(review.comment_count).toEqual(expect.any(Number));
        });
      });
  });
  test("returns an array of review objects sorted by a default of data in a default of descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns an array of review objects sorted by passed query of review id", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("review_id", { descending: true });
      });
  });
  test("returns an array of review objects sorted by passed query of review id in order of passed query: ascending", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("review_id", { ascending: true });
      });
  });
  test("returns an array of review objects filtered by category", () => {
    return request(app)
      .get(
        "/api/reviews?sort_by=review_id&order=asc&category=social%20deduction"
      )
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("review_id", { ascending: true });
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("returns status 400 if given invalid sortBy", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("returns status 400 if given invalid order", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("returns status 404 if category filtered by doesn't exist doesn't exist", () => {
    return request(app)
      .get(
        "/api/reviews?/api/reviews?sort_by=review_id&order=asc&category=notacategory"
      )
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("category not found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns a status of 200 and an array", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
      });
  });
  test("returns an array of comment objects with correct key-value pairs", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment.comment_id).toEqual(expect.any(Number));
          expect(comment.body).toEqual(expect.any(String));
          expect(comment.review_id).toEqual(expect.any(Number));
          expect(comment.author).toEqual(expect.any(String));
          expect(comment.votes).toEqual(expect.any(Number));
          expect(comment.created_at).toEqual(expect.any(String));
        });
      });
  });
  test("returns a status of 200 and empty array when review_id exists but no comments are referenced to it", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("Returns a status of 404 when given id which doesn't exist", () => {
    return request(app)
      .get("/api/reviews/67/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a status of 400 when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("returns status 201 and newly added object", () => {
    const addComment = { username: "mallionaire", body: "blah blah blah" };
    const returnObj = {
      comment_id: 7,
      body: "blah blah blah",
      votes: 0,
      author: "mallionaire",
      review_id: 1,
      created_at: "2022-08-02T10:41:48.829Z",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(addComment)
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment.comment_id).toBe(7);
        expect(newComment.body).toBe("blah blah blah");
        expect(newComment.votes).toBe(0);
        expect(newComment.author).toBe("mallionaire");
        expect(newComment.review_id).toBe(1);
        expect(newComment.created_at).toEqual(expect.any(String));
      });
  });
  test("Returns a status of 400 when given a malformed body/missing fields/incorrect type", () => {
    const addComment = {};
    return request(app)
      .post("/api/reviews/1/comments")
      .send(addComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Returns a status of 400 when given an invalid id", () => {
    const addComment = { username: "mallionaire", body: "blah blah blah" };
    return request(app)
      .post("/api/reviews/invalid_id/comments")
      .send(addComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Returns a status of 404 when given id which doesn't exist", () => {
    const addComment = { username: "mallionaire", body: "blah blah blah" };
    return request(app)
      .post("/api/reviews/67/comments")
      .send(addComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a status of 404 when given username which doesn't exist", () => {
    const addComment = { username: "notAName", body: "blah blah blah" };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(addComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("returns a status of 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("returns a status of 404 if comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("returns a status of 400 if given invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
