
export interface AuthUser {
    walletAddress: string;
    userId: string;
    token: string;
}

export interface AuthStoreType {
    getUser: () => AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const AuthStore = (): AuthStoreType => {
    let user: AuthUser | null = null;

    const getUser = () => {
        return user;
    };

    const login = (updatedUser: AuthUser) => {
        user = updatedUser;
    };
    const logout = () => {
        user = null;
    };
    return { getUser, login, logout };
};

