import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = (await global.signin()) as any;
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie[0]) //sending the cookie back to server for next api call.
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeDefined();
});
