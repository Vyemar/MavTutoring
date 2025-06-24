// MSAL Configuration

export const msalConfig = {
  auth: {
    clientId: "4b9962f6-ff51-4932-b950-5740df3907cc", // from Azure, unique ID for our app
    authority: "https://login.microsoftonline.com/81f5c75c-a836-4487-b800-205152ea1e38", // from Azure, where to send user
    redirectUri: "http://localhost:3000/blank.html" // Fixes logging in issues
  },

  cache: {
     cacheLocation: "localStorage", // Tokens are persistent even after a refresh
     storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["User.Read", "Calendars.ReadWrite"] // When logging in, we need permission to do these things
};
