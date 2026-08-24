import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether a saved customer session is still valid
  useEffect(() => {
    const token = localStorage.getItem('customerToken');

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCurrentCustomer = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/customers/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Token is invalid or expired
          localStorage.removeItem('customerToken');
          setCustomer(null);
          return;
        }

        const data = await response.json();

        setCustomer(data.customer);
      } catch (err) {
        console.error('Failed to restore customer session:', err);

        localStorage.removeItem('customerToken');
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentCustomer();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await fetch(
      `${API_URL}/api/auth/customer/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Login failed.'
      );
    }

    localStorage.setItem(
      'customerToken',
      data.token
    );

    setCustomer(data.customer);

    return data.customer;
  };

  // Signup
  const signup = async (name, email, password) => {
    const response = await fetch(
      `${API_URL}/api/auth/customer/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Signup failed.'
      );
    }

    localStorage.setItem(
      'customerToken',
      data.token
    );

    setCustomer(data.customer);

    return data.customer;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('customerToken');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}