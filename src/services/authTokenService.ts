export const getAuthToken = () => {
    // Implement your logic to retrieve the auth token
    const data = JSON.parse(localStorage.getItem("admin-store") || "{}");
    return data.state?.user?.token;
};
