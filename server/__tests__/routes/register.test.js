const request = require("supertest");
const app = require("../../index");
const db = require("../../test.db");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const endpoint = "/api/auth/register";

describe(`POST ${endpoint}`, () => {
  beforeAll(db.connect);

  afterAll(db.disconnect);

  beforeEach(async () => {
    // initial data
    await User.create({
      username: "felipera2",
      email: "f2@f.com",
      password: bcrypt.hashSync("123123123", 8),
    });
  });

  afterEach(db.clear);

  /* sanitizing tests */

  it("should reject when the username is missing", async () => {
    const response = await request(app).post(endpoint).send({
      password: "123123123",
      email: "f@f.com",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when the password is missing", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      email: "f@f.com",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when the email is missing", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when passing a small username", async () => {
    const response = await request(app).post(endpoint).send({
      username: "fel",
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when passing a small password", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      email: "f@f.com",
      password: "123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when passing a non-email as email", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      email: "f@.com",
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  /* create tests */

  it("should reject when passing an already used username", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera2",
      email: "f@f.com",
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject when passing an already used email", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      email: "f2@f.com",
      password: "123123123",
    });

    expect(response.status).toBe(400);
  });

  it("should accept when passing a correct username, email and password", async () => {
    const response = await request(app).post(endpoint).send({
      username: "felipera",
      email: "f@f.com",
      password: "123123123",
    });

    expect(response.status).toBe(201);
  });
});
