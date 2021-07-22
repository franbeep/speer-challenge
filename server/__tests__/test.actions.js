const db = require("../test.db");

beforeAll(db.connect);

afterEach(db.clear);

afterAll(db.disconnect);
