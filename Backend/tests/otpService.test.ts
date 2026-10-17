jest.mock("../src/modules/auth/otpModel", () => ({
  Otp: {
    deleteMany: jest.fn().mockResolvedValue(true),
    create: jest.fn().mockResolvedValue({}),
    findOne: jest.fn(),
  },
}));

jest.mock("../src/config/mailer", () => ({
  transporter: { sendMail: jest.fn() },
}));

describe("sendOtp", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...originalEnv,
      SMTP_USER: "",
      SMTP_PASS: "",
      SENDLIBERTY_API_KEY: "test-api-key",
      SENDLIBERTY_API_URL: "https://sendliberty.com/api/send",
      SENDLIBERTY_FROM: '"Rekindle" <noibisjunior22@gmail.com>',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    }) as any;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("uses the Sendliberty API when an API key is configured", async () => {
    const { sendOtp } = await import("../src/modules/auth/otpService");

    await sendOtp("user@example.com");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://sendliberty.com/api/send",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-key",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("keeps signup flow resilient when the Sendliberty API rejects the email send", async () => {
    const { sendOtp } = await import("../src/modules/auth/otpService");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue("sender mismatch"),
    });

    await expect(sendOtp("user@example.com")).resolves.toBe(true);
  });
});
