// MSAL Configuration

export const msalConfig = {
  auth: {
    clientId: "4b9962f6-ff51-4932-b950-5740df3907cc", // from Azure, unique ID for our app
    authority: "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/saml2", // from Azure, where to send user
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
