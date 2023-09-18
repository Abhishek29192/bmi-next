import { renderHook } from "@testing-library/react-hooks";
import useAuth from "../hooks/useAuth";
import auth, { SessionState } from "../auth/service";

const mockIsAuthenticated = jest.fn();
const mockGetUserProfile = jest.fn();

jest.mock("../auth/service", () => ({
  __esModule: true,
  default: {
    isAuthenticated: (...arg: unknown[]) => mockIsAuthenticated(...arg),
    getUserProfile: (...arg: unknown[]) => mockGetUserProfile(...arg),
    checkSession: jest.fn()
  }
}));

const mockUserProfile = {
  name: "Test User",
  email: "test@example.com"
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useAuth", () => {
  it("should initialize with loading state", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });

  it("should initialize with user not logged in", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(false);
  });

  it("should initialize with user profile when logged in", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetUserProfile.mockReturnValue(mockUserProfile);

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.profile).toEqual(mockUserProfile);
  });

  it("should update state when session state changes", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    const newState: SessionState = {
      isLoggedIn: true,
      idToken: "id"
    };
    auth.sessionStateCallback(newState);

    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);
  });
});
