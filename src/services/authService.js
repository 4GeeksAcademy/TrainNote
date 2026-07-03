const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
};

export const registerUser = async (email, password, username) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    const textData = await response.text();
    const data = textData ? JSON.parse(textData) : {};

    if (!response.ok) {
      const errorMessage = data.message || `Registration failed (Status: ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error;
  }
};