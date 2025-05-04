const request = require("supertest");
const app = require("../server"); // Din Express app
const mongoose = require("mongoose");

// Før alle tests: Forbind til MongoDB
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// GET: Tjekker om API'et returnerer status 200 og en array
test("GET /api/names should return status 200 and an array", async () => {
  const res = await request(app).get("/api/names");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

// POST: Tilføjer et navn og forventer status 201
test("POST /api/names should add a new name", async () => {
  const res = await request(app)
    .post("/api/names")
    .send({ name: "TestPerson" });

  expect(res.statusCode).toBe(218);
});

// POST: Sender ugyldige data og forventer fejl (status 400)
test("POST /api/names without name should fail", async () => {
  const res = await request(app).post("/api/names").send({});

  // 400 Bad Request → Betyder at klienten (fx brugeren) sendte noget ugyldigt
  expect(res.statusCode).toBe(400);
});

// GET: Bekræfter at det nye navn faktisk blev gemt
test("GET /api/names should include recently added name", async () => {
  const res = await request(app).get("/api/names");
  const names = res.body.map((n) => n.name);
  expect(names).toContain("TestPerson");
});

// Efter alle tests: Luk MongoDB-forbindelsen
afterAll(async () => {
  await mongoose.connection.close();
});
