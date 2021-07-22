const request = require("supertest");
const app = require("../../index");
const db = require("../../test.db");
const User = require("../../models/user");
const Tweet = require("../../models/tweet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let token;
let user;
let tweet;

beforeAll(db.connect);

afterEach(db.clear);

afterAll(db.disconnect);

beforeEach(async () => {
  // initial data
  await User.create({
    username: "felipera",
    email: "f@f.com",
    password: bcrypt.hashSync("123123123", 8),
  }).then((_user) => {
    user = _user;
    token = jwt.sign({ id: _user._id }, process.env.SECRET, {
      expiresIn: 86400, // 24h
    });
  });

  await Tweet.create({
    message:
      "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. -- Suaron",
    user: user._id,
  }).then((_tweet) => {
    tweet = _tweet;
  });
});

const endpoint = "/api/tweet";

describe(`POST ${endpoint}`, () => {
  it("should reject when message is missing", async () => {
    const response = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it("should reject when message is larger than 280", async () => {
    const message =
      "feliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafelipera";

    const response = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ message });
    expect(response.status).toBe(400);
  });

  it("should accept when message is correct", async () => {
    const message = "The salted pork is particularly good! -- Pippin, Meriadoc";

    const response = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ message });
    expect(response.status).toBe(201);
  });
});

describe(`GET ${endpoint}`, () => {
  it("should reject when id is missing", async () => {
    const response = await request(app)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .query({});
    expect(response.status).toBe(400);
  });

  it("should accept when id is correct (or incorret)", async () => {
    const response = await request(app)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .query({ id: "" + tweet._id }); // hacks! otherwise ID would be transformed (for god knows reasons) into a object
    expect(response.status).toBe(200);
  });
});

describe(`GET ${endpoint}/user`, () => {
  it("should reject when id is missing", async () => {
    const response = await request(app)
      .get(endpoint + "/user")
      .set("Authorization", `Bearer ${token}`)
      .query({});
    expect(response.status).toBe(400);
  });

  it("should accept when id is correct (or incorret)", async () => {
    const response = await request(app)
      .get(endpoint + "/user")
      .set("Authorization", `Bearer ${token}`)
      .query({ username: user.username });
    expect(response.status).toBe(200);
  });
});

describe(`PUT ${endpoint}`, () => {
  it("should reject when id is missing", async () => {
    const response = await request(app)
      .put(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "foo" });
    expect(response.status).toBe(400);
  });

  it("should reject when message is missing", async () => {
    const response = await request(app)
      .put(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ id: tweet._id });
    expect(response.status).toBe(400);
  });

  it("should reject when message is larger than 280", async () => {
    const message =
      "feliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafeliperafelipera";

    const response = await request(app)
      .put(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ message, id: tweet._id });
    expect(response.status).toBe(400);
  });

  it("should accept when message and id are correct", async () => {
    const message = "Fly you fools -- Gandalf the Gray";

    const response = await request(app)
      .put(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ message, id: tweet._id });
    expect(response.status).toBe(201);
  });
});

describe(`DELETE ${endpoint}`, () => {
  it("should reject when id is missing", async () => {
    const response = await request(app)
      .delete(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it("should accept when id is correct", async () => {
    const response = await request(app)
      .delete(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ id: tweet._id });
    expect(response.status).toBe(200);
  });
});
