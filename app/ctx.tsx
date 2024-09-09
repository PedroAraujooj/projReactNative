import { useContext, createContext, type PropsWithChildren } from 'react';
import {setStorageItemAsync, useStorageState} from './useStorageState';
import {User} from "@firebase/auth";
import {createTableUser, dropTable} from "@/app/infra/database";

const AuthContext = createContext<{
    signIn: (user:string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    theme?: string | null;
    user?: string | null;
    changeTheme: (theme: string) => void;
    changeUser: (user: string) => void;
    isLoadingTheme: boolean;
    isLoadingUser: boolean;

}>({
    theme: "xxx",
    signIn: (user:string) => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    changeTheme: async (theme: string) => null,
    changeUser: async (user: string) => null,
    isLoadingTheme: false,
    isLoadingUser: false,

});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[isLoadingTheme, theme], setTheme] = useStorageState('theme');
    const [[isLoadingUser, user], setUser] = useStorageState('user');


    return (
        <AuthContext.Provider
            value={{
                signIn: (userSign : string) => {
                    // Perform sign-in logic here
                    setSession("true");
                    setUser(userSign);
                },
                signOut: async() => {
                    setSession(null);
                    setSession(null);
                    await dropTable("usuario");
                    await createTableUser();
                },
                changeTheme: (theme: string) => {
                    setTheme(theme);
                },
                changeUser:  (user: string) => {
                    setUser(user);
                },
                session,
                isLoading,
                theme,
                isLoadingTheme,
                isLoadingUser,
                user,

            }}>
            {children}
        </AuthContext.Provider>
    );
}
