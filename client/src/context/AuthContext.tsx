import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Permission,
  UserRole,
  evaluateAccessPolicy,
  AccessSubject,
  AccessResource,
  AccessDecision,
} from "@aire/authorization";
import {
  AuthApi,
  AuthContextResponse,
  setActiveTenantHeader,
  getActiveTenantHeader,
} from "@/lib/api";

export interface AuthContextType {
  user: AuthContextResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  memberships: AuthContextResponse["memberships"];
  activeInstitution: AuthContextResponse["activeInstitution"];
  platformRoles: string[];
  permissions: Permission[];
  setActiveInstitutionId: (id: string) => Promise<void>;
  can: (permission: Permission, resource?: AccessResource) => boolean;
  evaluate: (
    permission: Permission,
    resource?: AccessResource,
  ) => AccessDecision;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextResponse["user"] | null>(null);
  const [memberships, setMemberships] = useState<
    AuthContextResponse["memberships"]
  >([]);
  const [activeInstitution, setActiveInstitution] =
    useState<AuthContextResponse["activeInstitution"]>(null);
  const [platformRoles, setPlatformRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthContext = useCallback(async (targetInstitutionId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const preferredTenant =
        targetInstitutionId || getActiveTenantHeader() || undefined;
      const data = await AuthApi.getMe(preferredTenant);
      setUser(data.user);
      setMemberships(data.memberships);
      setActiveInstitution(data.activeInstitution);
      setPlatformRoles(data.platformRoles);
      setPermissions(data.permissions);

      if (data.activeInstitution?.id) {
        setActiveTenantHeader(data.activeInstitution.id);
      }
    } catch (err: any) {
      // 401 or no active session is normal when unauthenticated
      setUser(null);
      setMemberships([]);
      setActiveInstitution(null);
      setPlatformRoles([]);
      setPermissions([]);
      if (err.code !== "UNAUTHORIZED" && err.code !== "HTTP_ERROR") {
        setError(err.message || "Failed to load authentication state");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthContext();
  }, [fetchAuthContext]);

  const setActiveInstitutionId = useCallback(
    async (id: string) => {
      setActiveTenantHeader(id);
      await fetchAuthContext(id);
    },
    [fetchAuthContext],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await AuthApi.signIn(email, password);
        await fetchAuthContext();
      } catch (err: any) {
        setError(err.message || "Invalid credentials");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthContext],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthApi.signOut();
      setActiveTenantHeader(null);
      setUser(null);
      setMemberships([]);
      setActiveInstitution(null);
      setPlatformRoles([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    await fetchAuthContext(activeInstitution?.id);
  }, [fetchAuthContext, activeInstitution?.id]);

  const subject = useMemo<AccessSubject>(() => {
    const roles: (UserRole | string)[] = [...platformRoles];
    if (activeInstitution?.role) {
      roles.push(activeInstitution.role);
    }
    return {
      userId: user?.id || "ANONYMOUS",
      roles,
      activeInstitutionId: activeInstitution?.id,
      institutionMemberships: memberships.map((m) => ({
        institutionId: m.institutionId,
        role: m.role,
        status: m.status,
      })),
      platformRoles,
    };
  }, [user?.id, platformRoles, activeInstitution, memberships]);

  const evaluate = useCallback(
    (permission: Permission, resource?: AccessResource): AccessDecision => {
      return evaluateAccessPolicy(subject, permission, resource);
    },
    [subject],
  );

  const can = useCallback(
    (permission: Permission, resource?: AccessResource): boolean => {
      return evaluate(permission, resource).allowed;
    },
    [evaluate],
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    memberships,
    activeInstitution,
    platformRoles,
    permissions,
    setActiveInstitutionId,
    can,
    evaluate,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  memberships: [],
  activeInstitution: null,
  platformRoles: [],
  permissions: [],
  setActiveInstitutionId: async () => {},
  can: () => true,
  evaluate: () => ({ allowed: true }),
  login: async () => {},
  logout: async () => {},
  refreshAuth: async () => {},
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthContext;
  }
  return context;
};
