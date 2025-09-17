const request = require("supertest");
const app = require("../server");

describe("Auth APIs", () => {
	test("POST /api/auth/register → registers a new student", async () => {
		const res = await request(app)
			.post("/api/auth/register")
			.send({
				name: "Test Student",
				email: "student@example.com",
				password: "123456",
				role: "student",
				university: "Test University",
				department: "CS",
				year: 3
			});
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("token");
		expect(res.body).toHaveProperty("email", "student@example.com");
	});

	test("POST /api/auth/login → logs in with valid credentials", async () => {
		// Seed user
		await request(app)
			.post("/api/auth/register")
			.send({
				name: "Test Student",
				email: "student2@example.com",
				password: "123456",
				role: "student",
				university: "Test University"
			});

		const res = await request(app)
			.post("/api/auth/login")
			.send({
				email: "student2@example.com",
				password: "123456"
			});
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("token");
	});
});
