const request = require("supertest");
const app = require("../../index");
const db = require("../../test.db");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const sinon = require("sinon");

beforeAll(async () => await db.connect());

beforeEach(async () => {
  // initial data
  await User.create({
    username: "felipera",
    email: "f@f.com",
    password: bcrypt.hashSync("123123123", 8),
  });
});

afterEach(async () => {
  await db.clear();
});

afterAll(async () => await db.disconnect());

const endpoint = "/api/auth/restricted";

describe(`GET ${endpoint}`, () => {
  it("should reject when accessing without token", async () => {
    const response = await request(app)
      .get(endpoint)
      .set("Authorization", "Bearer");

    expect(response.status).toBe(401);
  });

  it("should reject when accessing with wrong token", async () => {
    const response = await request(app)
      .get(endpoint)
      .set("Authorization", "Bearer WRONGTOKEN");

    expect(response.status).toBe(401);
  });

  it("should reject when accessing without Authorization header", async () => {
    const response = await request(app).get(endpoint);

    expect(response.status).toBe(401);
  });

  // Obs: since jwt doesn't invalidate a token (only time), it turns out to be quite difficult to test an experied token;
  // sinon should be the correct way of simulating it but I couldn't make it work in time
  // it("should reject when accessing with expired token", async () => {
  // });

  it("should accept when accessing with correct token", async () => {
    await User.findOne({ username: "felipera" })
      .lean()
      .then(async (user) => {
        var token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: 100, // 100 sec
        });
        const response = await request(app)
          .get(endpoint)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
      });
  });
});
