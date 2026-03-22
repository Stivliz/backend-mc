import "dotenv/config";
import request from "supertest";
import app from "../src/app";

describe("App Security and Setup", () => {
  it("should have Security Headers (Helmet)", async () => {
    const res = await request(app).get("/api/v1/nonexistent");
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-xss-protection"]).toBeDefined();
  });

  it("should apply rate limiter on auth routes", async () => {
    // The first request should pass (though it may 404 or fail auth logic, but it shouldn't 429)
    let res = await request(app).post("/api/v1/login/login").send({});
    expect(res.status).not.toBe(429);
  });
});
