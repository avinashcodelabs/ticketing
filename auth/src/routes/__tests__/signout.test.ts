import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const signUpCookie = await global.signin() as any;

  const response = await request(app)
    .post("/api/users/signout")
    .set("Cookie", signUpCookie[0]) //sending the cookie back to server for next api call. As supertest, unlike browser or postman, wont sent the cookie automatically
    .send({})
    .expect(200);

  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  expect(cookie[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
})
