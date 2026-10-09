import { createContext, useContext, useEffect, useState } from 'react';

const ArtistAuthContext = createContext(null);

const API_URL = 'http://localhost:5000';

export function ArtistAuthProvider({ children }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore artist session
  useEffect(() => {
    const token = localStorage.getItem('artistToken');

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCurrentArtist = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/artist/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem('artistToken');
          setArtist(null);
          return;
        }

        const data = await response.json();

        setArtist(data.artist);
      } catch (err) {
        console.error(
          'Failed to restore artist session:',
          err
        );

        localStorage.removeItem('artistToken');
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentArtist();
  }, []);

  // Artist login
  const login = async (email, password) => {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
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
      'artistToken',
      data.token
    );

    setArtist(data.artist);

    return data.artist;
  };

  // Artist logout
  const logout = () => {
    localStorage.removeItem('artistToken');
    setArtist(null);
  };

  return (
    <ArtistAuthContext.Provider
      value={{
        artist,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </ArtistAuthContext.Provider>
  );
}

export function useArtistAuth() {
  const context = useContext(ArtistAuthContext);

  if (!context) {
    throw new Error(
      'useArtistAuth must be used inside ArtistAuthProvider'
    );
  }

  return context;
}