import { createRocket } from "../src";

describe("blah", () => {
	it("works", () => {
		const rocket = createRocket();
		expect(Boolean(typeof rocket === "object")).toBe(true);
	});
});
