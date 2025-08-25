export const getAuthToken = () => {
  // Implement your logic to retrieve the auth token
  const response = localStorage.getItem("admin-store") || "";
  console.log("Auth Token:", response);
//   return response;
};
