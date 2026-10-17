import { updateProfileSchema } from "../src/modules/users/userSchema";

describe("updateProfileSchema", () => {
  it("accepts data URLs for profile photos and social links in the expected shape", () => {
    const parsed = updateProfileSchema.safeParse({
      fullName: "Jane Doe",
      photoUrl: "data:image/png;base64,abc123",
      socials: {
        linkedin: "https://linkedin.com/in/janedoe",
      },
      tags: ["Engineer", "Product"],
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.photoUrl).toBe("data:image/png;base64,abc123");
      expect(parsed.data.socials?.linkedin).toBe("https://linkedin.com/in/janedoe");
    }
  });
});
