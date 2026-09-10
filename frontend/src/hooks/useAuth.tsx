import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UserProfile = {
  fullName: string;
  phone: string;
  password: string;
  birthDate: string;
  gender: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  address: string;
  avatarUrl: string;
};
type ApiUser = {
  name: string;
  whatsapp: string;
  birth_date?: string | null;
  gender?: string | null;
  province?: string | null;
  regency?: string | null;
  district?: string | null;
  village?: string | null;
  postal_code?: string | null;
  address?: string | null;
  avatar_url?: string | null;
};
type AuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (profile: Pick<UserProfile, "fullName" | "phone" | "password">) => Promise<boolean>;
  updateProfile: (profile: UserProfile, avatar?: File | null) => Promise<boolean>;
  logout: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);
const userKey = "crousel-user";
const sessionKey = "crousel-session";
const tokenKey = "crousel-api-token";
const apiUrl = import.meta.env.VITE_API_URL;

function mapApiUser(user: ApiUser, password = ""): UserProfile {
  return {
    fullName: user.name ?? "",
    phone: user.whatsapp ?? "",
    password,
    birthDate: user.birth_date ?? "",
    gender:
      user.gender === "female"
        ? "Perempuan"
        : user.gender === "male"
          ? "Laki-laki"
          : user.gender === "other"
            ? "Tidak ingin menyebutkan"
            : (user.gender ?? ""),
    province: user.province ?? "",
    city: user.regency ?? "",
    district: user.district ?? "",
    village: user.village ?? "",
    postalCode: user.postal_code ?? "",
    address: user.address ?? "",
    avatarUrl: user.avatar_url ?? "",
  };
}
function readUser(): UserProfile | null {
  try {
    const value = window.localStorage.getItem(userKey);
    return value ? (JSON.parse(value) as UserProfile) : null;
  } catch {
    return null;
  }
}
function saveUser(profile: UserProfile) {
  window.localStorage.setItem(userKey, JSON.stringify(profile));
}
async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T;
  if (!response.ok) throw new Error("Permintaan akun gagal");
  return payload;
}
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() =>
    window.localStorage.getItem(sessionKey) === "active" ? readUser() : null,
  );
  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (phone, password) => {
        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ whatsapp: phone.trim(), password }),
          });
          const payload = await parseResponse<{ data: { user: ApiUser; token: string } }>(response);
          const profile = mapApiUser(payload.data.user, password);
          saveUser(profile);
          window.localStorage.setItem(sessionKey, "active");
          window.localStorage.setItem(tokenKey, payload.data.token);
          setUser(profile);
          return true;
        } catch {
          const storedUser = readUser();
          if (!storedUser || storedUser.phone !== phone || storedUser.password !== password) return false;
          window.localStorage.setItem(sessionKey, "active");
          setUser(storedUser);
          return true;
        }
      },
      register: async ({ fullName, phone, password }) => {
        const fallback: UserProfile = {
          fullName,
          phone,
          password,
          birthDate: "",
          gender: "",
          province: "",
          city: "",
          district: "",
          village: "",
          postalCode: "",
          address: "",
          avatarUrl: "",
        };
        try {
          const response = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ name: fullName, whatsapp: phone.trim(), password }),
          });
          const payload = await parseResponse<{ data: { user: ApiUser; token: string } }>(response);
          const profile = mapApiUser(payload.data.user, password);
          saveUser(profile);
          window.localStorage.setItem(sessionKey, "active");
          window.localStorage.setItem(tokenKey, payload.data.token);
          setUser(profile);
          return true;
        } catch {
          saveUser(fallback);
          window.localStorage.setItem(sessionKey, "active");
          setUser(fallback);
          return true;
        }
      },
      updateProfile: async (profile, avatar) => {
        let token = window.localStorage.getItem(tokenKey);
        if (!token && profile.password) {
          try {
            const loginResponse = await fetch(`${apiUrl}/auth/login`, {
              method: "POST",
              headers: { Accept: "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({ whatsapp: profile.phone, password: profile.password }),
            });
            const loginPayload = await parseResponse<{ data: { token: string } }>(loginResponse);
            token = loginPayload.data.token;
            window.localStorage.setItem(tokenKey, token);
          } catch {
            token = null;
          }
        }
        if (!token) {
          const localProfile = avatar ? { ...profile, avatarUrl: await fileToDataUrl(avatar) } : profile;
          saveUser(localProfile);
          setUser(localProfile);
          return true;
        }
        try {
          const body = new FormData();
          const fields: Record<string, string> = {
            name: profile.fullName,
            whatsapp: profile.phone,
            birth_date: profile.birthDate,
            gender:
              profile.gender === "Perempuan"
                ? "female"
                : profile.gender === "Laki-laki"
                  ? "male"
                  : profile.gender === "Tidak ingin menyebutkan"
                    ? "other"
                    : profile.gender,
            province: profile.province,
            regency: profile.city,
            district: profile.district,
            village: profile.village,
            postal_code: profile.postalCode,
            address: profile.address,
          };
          Object.entries(fields).forEach(([key, value]) => body.append(key, value));
          if (avatar) body.append("avatar", avatar);
          const response = await fetch(`${apiUrl}/profile`, {
            method: "POST",
            headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
            body,
          });
          const payload = await parseResponse<{ data: { user: ApiUser } }>(response);
          const updated = mapApiUser(payload.data.user, profile.password);
          saveUser(updated);
          setUser(updated);
          return true;
        } catch {
          return false;
        }
      },
      logout: () => {
        window.localStorage.removeItem(sessionKey);
        window.localStorage.removeItem(tokenKey);
        setUser(null);
      },
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
