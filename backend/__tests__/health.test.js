/* eslint-disable no-undef */
import request from "supertest";
import { createApp } from "../app.js";

describe("Health endpoint", () => {
  it("returns ok", async () => {
    const app = createApp();
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
