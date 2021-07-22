const request = require("supertest");
const app = require("../../index");
const db = require("../../test.db");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const endpoint = "/api/auth/login";

describe(`POST ${endpoint}`, () => {
  beforeAll(db.connect);

  beforeEach(async () => {
    // initial data
    await User.create({
      username: "felipera",
      email: "f@f.com",
      password: bcrypt.hashSync("123123123", 8),
    });
  });

  afterAll(db.disconnect);

  afterEach(db.clear);

  /* sanitizing tests */

  it("should reject when the username is missing", async () => {
    const response = await request(app).post(endpoint).send({
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when the password is missing", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when passing a big username", async () => {
    const response = await request(app).post(endpoint).send({
      username: "feliperafeliperafeliperafeliperafeliperafeliperafelipera", // 56 characters
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  /* credentials tests */

  it("should reject when passing a correct username but incorrect password", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      password: "321321321",
    });

    expect(response.status).toBe(401);
  });

  it("should reject when passing a correct password but incorrect username", async () => {
    const response = await request(app).post(endpoint).send({
      username: "foobar",
      password: "123123123",
    });

    expect(response.status).toBe(401);
  });

  it("should accept when passing a correct username and password", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      password: "123123123",
    });

    expect(response.status).toBe(201);
  });
});
