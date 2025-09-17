const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

async function login(email, password) {
	const res = await request(app).post("/api/auth/login").send({ email, password });
	return res.body.token;
}

describe("Results APIs", () => {
	let adminToken;
	let electionId;

	beforeAll(async () => {
		await request(app).post("/api/auth/register").send({
			name: "Admin",
			email: "admin@example.com",
			password: "admin123",
			role: "admin",
			university: "Test U"
		});
		const admin = await User.findOne({ email: "admin@example.com" });
		adminToken = await login("admin@example.com", "admin123");

		// Create completed election with one approved candidate
		const now = new Date();
		const election = await Election.create({
			title: "Finished Election",
			description: "Past election",
			startDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
			endDate: new Date(now.getTime() - 60 * 60 * 1000),
			isActive: false,
			isCompleted: true,
			totalVotes: 0,
			createdBy: admin._id
		});
		electionId = election._id.toString();

		await Candidate.create({
			name: "Bob",
			studentId: "S456",
			email: "bob@example.com",
			position: "President",
			department: "CS",
			year: 3,
			manifesto: "Transparency and progress",
			isApproved: true,
			election: election._id,
			voteCount: 0
		});
	});

	test("GET /api/votes/results/:electionId → fetches election results", async () => {
		const res = await request(app)
			.get(`/api/votes/results/${electionId}`)
			.set("Authorization", `Bearer ${adminToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("results");
	});
});
