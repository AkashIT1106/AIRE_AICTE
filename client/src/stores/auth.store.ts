/**
 * Auth store using Zustand.
 * Manages user session, platform roles, institution memberships, and active institution.
 */

import { create } from "zustand";
import type { AuthUserDto, InstitutionDto } from "@aire/shared-types";
import { UserRole } from "@aire/authorization";
import { api, ApiError } from "@/lib/api";

interface InstitutionMembership {
  institutionId: string;
  role: string;
  status: string;
  name: string;
}

interface AuthState {
  user: AuthUserDto | null;
  platformRoles: UserRole[];
  institutionMemberships: InstitutionMembership[];
  activeInstitutionId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setActiveInstitution: (id: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  platformRoles: [],
  institutionMemberships: [],
  activeInstitutionId: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  async initialize() {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      // 1. Get current session
      const sessionData = await api.get<{ user: AuthUserDto; session: unknown }>("/auth/session");

      if (!sessionData?.user) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const user = sessionData.user;

      // 2. Get platform roles (best-effort)
      let platformRoles: UserRole[] = [];
      try {
        const rolesData = await api.get<{ roles: UserRole[] }>("/auth/me/roles");
        platformRoles = rolesData?.roles ?? [];
      } catch {
        // roles endpoint may not exist yet — degrade gracefully
      }

      // 3. Get institution memberships (best-effort)
      let institutionMemberships: InstitutionMembership[] = [];
      try {
        const institutions = await api.get<InstitutionDto[]>("/institutions");
        if (Array.isArray(institutions)) {
          institutionMemberships = institutions.map((inst) => ({
            institutionId: inst.id,
            role: "MEMBER",
            status: inst.status ?? "ACTIVE",
            name: inst.name,
          }));
        }
      } catch {
        // institutions endpoint may require more context — degrade gracefully
      }

      const firstInstitutionId =
        institutionMemberships.length > 0
          ? institutionMemberships[0].institutionId
          : null;

      set({
        user,
        platformRoles,
        institutionMemberships,
        activeInstitutionId: firstInstitutionId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      // 401 is a normal "not logged in" state — not an error
      if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
        set({ isLoading: false, isAuthenticated: false, user: null });
      } else {
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: err instanceof Error ? err.message : "Failed to initialize session",
        });
      }
    }
  },

  async signIn(email: string, password: string) {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<{ user: AuthUserDto; session: unknown }>("/auth/sign-in", {
        email,
        password,
      });

      if (!data?.user) {
        throw new Error("Invalid response from sign-in endpoint");
      }

      set({ isLoading: false });
      // Re-initialize to load roles and memberships
      await get().initialize();
    } catch (err) {
      set({
        isLoading: false,
        isAuthenticated: false,
        error: err instanceof Error ? err.message : "Sign in failed",
      });
      throw err;
    }
  },

  async signOut() {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/sign-out");
    } catch {
      // Proceed with local sign-out regardless of server errors
    }
    set({
      user: null,
      platformRoles: [],
      institutionMemberships: [],
      activeInstitutionId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  setActiveInstitution(id: string) {
    const membership = get().institutionMemberships.find(
      (m) => m.institutionId === id,
    );
    if (membership) {
      set({ activeInstitutionId: id });
    }
  },

  clearError() {
    set({ error: null });
  },
}));
