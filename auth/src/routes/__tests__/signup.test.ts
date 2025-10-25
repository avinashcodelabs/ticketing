import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(201)
    .then((response) => {
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toEqual("test@test.com");
    });
});

it("returns a 400 on invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test", // wrong format email here
      password: "password",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400);
});

it("returns a 400 on invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pas", // wrong password format i.e. less than 4 characters
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400);
});

it("returns a 400 on missing email or/and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send()
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(res.get("Set-Cookie")).toBeDefined();
});
