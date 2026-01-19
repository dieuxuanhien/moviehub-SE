// Jest setup file for api-gateway tests
// Mocks external modules that are not available in test environment

// Mock @clerk/clerk-sdk-node
jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: jest.fn(),
      getUserList: jest.fn(),
    },
    sessions: {
      verifySession: jest.fn(),
    },
  },
  createClerkClient: jest.fn(() => ({
    users: {
      getUser: jest.fn(),
      getUserList: jest.fn(),
    },
    sessions: {
      verifySession: jest.fn(),
    },
  })),
}));
