import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
  gender: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  village: string;
  villageId: string;
  postalCode: string;
  address: string;
  avatarUrl: string;
};
type ApiUser = {
  name: string;
  email: string;
  whatsapp: string;
  birth_date?: string | null;
  gender?: string | null;
  province?: string | null;
  province_id?: number | string | null;
  regency?: string | null;
  regency_id?: number | string | null;
  district?: string | null;
  district_id?: number | string | null;
  village?: string | null;
  village_id?: number | string | null;
  postal_code?: string | null;
  address?: string | null;
  avatar_url?: string | null;
};
type AuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (profile: Pick<UserProfile, "fullName" | "email" | "phone" | "password">) => Promise<boolean>;
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
    email: user.email ?? "",
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
    provinceId: user.province_id ? String(user.province_id) : "",
    city: user.regency ?? "",
    cityId: user.regency_id ? String(user.regency_id) : "",
    district: user.district ?? "",
    districtId: user.district_id ? String(user.district_id) : "",
    village: user.village ?? "",
    villageId: user.village_id ? String(user.village_id) : "",
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
  useEffect(() => {
    const token = window.localStorage.getItem(tokenKey);
    const savedPassword = readUser()?.password ?? "";
    if (window.localStorage.getItem(sessionKey) !== "active" || !token) return;
    const controller = new AbortController();
    fetch(`${apiUrl}/profile`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json()) as { data?: { user?: ApiUser } };
        return payload.data?.user ?? null;
      })
      .then((apiUser) => {
        if (apiUser) setUser(mapApiUser(apiUser, savedPassword));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          });
          const payload = await parseResponse<{ data: { user: ApiUser; token: string } }>(response);
          const profile = mapApiUser(payload.data.user, password);
          window.localStorage.removeItem("crousel-cart");
          saveUser(profile);
          window.localStorage.setItem(sessionKey, "active");
          window.localStorage.setItem(tokenKey, payload.data.token);
          setUser(profile);
          return true;
        } catch {
          const storedUser = readUser();
          if (!storedUser || storedUser.email !== email || storedUser.password !== password) return false;
          window.localStorage.setItem(sessionKey, "active");
          setUser(storedUser);
          return true;
        }
      },
      register: async ({ fullName, email, phone, password }) => {
        const fallback: UserProfile = {
          fullName,
          email,
          phone,
          password,
          birthDate: "",
          gender: "",
          province: "",
          provinceId: "",
          city: "",
          cityId: "",
          district: "",
          districtId: "",
          village: "",
          villageId: "",
          postalCode: "",
          address: "",
          avatarUrl: "",
        };
        try {
          const response = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ name: fullName, email: email.trim(), whatsapp: phone.trim(), password }),
          });
          const payload = await parseResponse<{ data: { user: ApiUser; token: string } }>(response);
          const profile = mapApiUser(payload.data.user, password);
          window.localStorage.removeItem("crousel-cart");
          saveUser(profile);
          window.localStorage.setItem(sessionKey, "active");
          window.localStorage.setItem(tokenKey, payload.data.token);
          setUser(profile);
          return true;
        } catch {
          window.localStorage.removeItem("crousel-cart");
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
              body: JSON.stringify({ email: profile.email, password: profile.password }),
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
            email: profile.email,
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
            province_id: profile.provinceId,
            regency: profile.city,
            regency_id: profile.cityId,
            district: profile.district,
            district_id: profile.districtId,
            village: profile.village,
            village_id: profile.villageId,
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
        window.localStorage.removeItem("crousel-cart");
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
