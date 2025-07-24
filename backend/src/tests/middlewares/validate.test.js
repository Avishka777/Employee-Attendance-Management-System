const { registerSchema, validate, loginSchema } = require("../../middlewares/validate");
const ApiError = require("../../utils/apiError");

describe("Validation Middleware", () => {
  const mockRequest = (body) => ({ body });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerSchema", () => {
    it("should pass validation with valid data", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "employee"
      });
      const res = mockResponse();

      await validate(registerSchema)(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid email", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        role: "employee"
      });
      const res = mockResponse();

      await validate(registerSchema)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain("Please provide a valid email");
    });

    it("should fail validation with short password", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "short",
        role: "employee"
      });
      const res = mockResponse();

      await validate(registerSchema)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain("Password must be at least 8 characters");
    });
  });

  describe("loginSchema", () => {
    it("should pass validation with valid data", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await validate(loginSchema)(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation with missing email", async () => {
      const req = mockRequest({
        password: "password123",
      });
      const res = mockResponse();

      await validate(loginSchema)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain("Please provide a valid email");
    });

    it("should fail validation with missing password", async () => {
      const req = mockRequest({
        email: "test@example.com",
      });
      const res = mockResponse();

      await validate(loginSchema)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain("Password is required");
    });
  });
});