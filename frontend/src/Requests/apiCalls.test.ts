import { beforeEach, describe, expect, it, vi } from "vitest";
import apiCalls from "./apiCalls";

function testJsonResponse(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
): Response {
  const ok = init.ok ?? true;
  const status = init.status ?? (ok ? 200 : 500);
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe("apiCalls", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("login", () => {
    it("POSTs to api/auth/login with username and password", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockResolvedValueOnce(
        testJsonResponse({ user_id: 1 }, { status: 200, ok: true }),
      );

      await apiCalls.login({ username: "u", password: "p" });

      expect(fetchMock).toHaveBeenCalledWith("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "u", password: "p" }),
      });
    });

    it("returns AUTH shape on 401 without writing localStorage", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { ok: false, status: 401 }),
      );

      const result = await apiCalls.login({ username: "u", password: "p" });

      expect(result).toEqual({
        success: false,
        type: "AUTH",
        message: "Invalid username or password",
      });
      expect(localStorage.getItem("username")).toBeNull();
      expect(localStorage.getItem("userId")).toBeNull();
    });

    it("sets localStorage and returns success on 200 with user_id", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({ user_id: 42 }, { status: 200, ok: true }),
      );

      const result = await apiCalls.login({ username: "alice", password: "secret" });

      expect(result).toEqual({
        success: true,
        message: "Successfully logged in!",
      });
      expect(localStorage.getItem("username")).toBe(JSON.stringify("alice"));
      expect(localStorage.getItem("userId")).toBe(JSON.stringify(42));
    });

    it("returns NETWORK on non-401 non-OK response", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { ok: false, status: 500 }),
      );

      const result = await apiCalls.login({ username: "u", password: "p" });

      expect(result).toEqual({
        success: false,
        type: "NETWORK",
        message: "Unable to reach server. Please try again.",
      });
    });

    it("returns NETWORK when fetch rejects", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("offline"));

      const result = await apiCalls.login({ username: "u", password: "p" });

      expect(result).toEqual({
        success: false,
        type: "NETWORK",
        message: "Unable to reach server. Please try again.",
      });
    });
  });

  describe("register", () => {
    it("POSTs to api/auth/register with username and password", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockResolvedValueOnce(
        testJsonResponse({ user_id: 2 }, { status: 200, ok: true }),
      );

      await apiCalls.register({ username: "new", password: "pw" });

      expect(fetchMock).toHaveBeenCalledWith("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "new", password: "pw" }),
      });
    });

    it("returns username-taken message on 409", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { ok: false, status: 409 }),
      );

      const result = await apiCalls.register({ username: "taken", password: "p" });

      expect(result).toEqual({
        success: false,
        message: "Username already exists. Please try a new username.",
      });
      expect(localStorage.getItem("username")).toBeNull();
    });

    it("sets localStorage and returns success when registration succeeds", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({ user_id: 99 }, { status: 201, ok: true }),
      );

      const result = await apiCalls.register({ username: "bob", password: "x" });

      expect(result).toEqual({
        success: true,
        message: "Successfully signed up!",
      });
      expect(localStorage.getItem("username")).toBe(JSON.stringify("bob"));
      expect(localStorage.getItem("userId")).toBe(JSON.stringify(99));
    });

    it("returns NETWORK on non-OK non-409 response", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { ok: false, status: 503 }),
      );

      const result = await apiCalls.register({ username: "u", password: "p" });

      expect(result).toEqual({
        success: false,
        type: "NETWORK",
        message: "Unable to reach server. Please try again.",
      });
    });

    it("returns NETWORK when fetch rejects", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("fail"));

      const result = await apiCalls.register({ username: "u", password: "p" });

      expect(result).toEqual({
        success: false,
        type: "NETWORK",
        message: "Unable to reach server. Please try again.",
      });
    });
  });

  describe("createTrip", () => {
    const tripArgs = {
      tripName: "Paris",
      description: "Spring",
      startDate: "2025-04-01",
      endDate: "2025-04-10",
    };

    it("returns without calling fetch when session is missing", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);

      const result = await apiCalls.createTrip(tripArgs);

      expect(result).toEqual({
        success: false,
        message: "Missing user session. Please log in again.",
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns without calling fetch when ownerId is invalid", async () => {
      localStorage.setItem("username", JSON.stringify("u"));
      localStorage.setItem("userId", JSON.stringify("not-a-number"));
      const fetchMock = vi.mocked(globalThis.fetch);

      const result = await apiCalls.createTrip(tripArgs);

      expect(result.success).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("POSTs snake_case body to /api/protected/createTrip and returns tripId on 200", async () => {
      localStorage.setItem("username", JSON.stringify("alice"));
      localStorage.setItem("userId", JSON.stringify(123));
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockResolvedValueOnce(
        testJsonResponse({ trip_id: 7 }, { status: 200, ok: true }),
      );

      const result = await apiCalls.createTrip(tripArgs);

      expect(fetchMock).toHaveBeenCalledWith("/api/protected/createTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_name: "Paris",
          description: "Spring",
          start_date: "2025-04-01",
          end_date: "2025-04-10",
          created_by: "alice",
          owner_id: 123,
        }),
      });
      expect(result).toEqual({ success: true, tripId: 7 });
    });

    it("returns failure when response is not ok", async () => {
      localStorage.setItem("username", JSON.stringify("alice"));
      localStorage.setItem("userId", JSON.stringify(1));
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { ok: false, status: 500 }),
      );

      const result = await apiCalls.createTrip(tripArgs);

      expect(result).toEqual({
        success: false,
        message: "Unable to create trip right now.",
      });
    });
  });

  describe("addMarker", () => {
    const markerArgs = {
      tripId: 1,
      markerLocation: "Eiffel Tower",
      markerDescription: "Visit",
      markerDate: "2025-04-02",
      markerLat: 48.86,
      markerLng: 2.29,
      username: "alice",
    };

    it("returns markerId on success", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({ marker_id: 55 }, { status: 200, ok: true }),
      );

      const result = await apiCalls.addMarker(markerArgs);

      expect(result).toEqual({ success: true, markerId: 55 });
    });

    it("returns success false when response is not ok", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "bad request" }),
      } as Response);

      const result = await apiCalls.addMarker(markerArgs);

      expect(result).toEqual({ success: false });
    });
  });

  describe("updateMarker", () => {
    const updateArgs = {
      markerId: 10,
      markerLocation: "Louvre",
      markerDescription: "Museum",
      markerDate: "2025-04-03",
    };

    it("returns success with markerId when ok", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { status: 200, ok: true }),
      );

      const result = await apiCalls.updateMarker(updateArgs);

      expect(result).toEqual({ success: true, markerId: 10 });
    });

    it("returns success false when not ok with error JSON", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "cannot update" }),
      } as Response);

      const result = await apiCalls.updateMarker(updateArgs);

      expect(result).toEqual({ success: false });
    });
  });

  describe("deleteMarker", () => {
    it("returns true when delete succeeds", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        testJsonResponse({}, { status: 204, ok: true }),
      );

      const result = await apiCalls.deleteMarker({ markerId: 5 });

      expect(result).toBe(true);
    });

    it("returns false when response is not ok", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "not found" }),
      } as Response);

      const result = await apiCalls.deleteMarker({ markerId: 5 });

      expect(result).toBe(false);
    });

    it("returns false when fetch rejects", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("network"));

      const result = await apiCalls.deleteMarker({ markerId: 5 });

      expect(result).toBe(false);
    });
  });
});
