import { expect } from 'chai';
import supertest from 'supertest';
import app from '../app';

describe("POST /auth/signup", () => {
  it("should create a new user", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.status).to.equal(201);
    expect(response.body)
      .to.have.property("message")
      .that.equals("User created successfully");
  });

  it("should handle missing fields", async () => {
    const response = await supertest(app).post("/auth/signup").send({});

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });

  it("should handle missing username", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });

  it("should handle missing email", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      username: "testuser",
      password: "testpassword",
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });

  it("should handle missing password", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });

  // Add more test cases as needed
});
