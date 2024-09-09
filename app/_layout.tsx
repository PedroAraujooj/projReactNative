import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Navigator, Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {createContext, useEffect, useState} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {PaperProvider, Text} from "react-native-paper";
import {SessionProvider, useSession} from "@/app/ctx";
import {darkTheme, lightTheme} from "@/constants/Theme";
import Slot = Navigator.Slot;
import {createTableUser} from "@/app/infra/database";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// @ts-ignore
export const ThemeContext = createContext();
export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const { theme, isLoadingTheme } = useSession();
    const[tema, setTema] = useState(colorScheme === 'light' ? lightTheme : darkTheme);
    const[logedUser, setLogedUser] = useState({});


    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }

    }, [loaded]);


    useEffect(() => {
        console.log(theme);
        if(theme === "dark"){
            setTema(darkTheme);
        }
        if(theme === "light"){
            setTema(lightTheme);
        }
        createTableUser();


    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{setTema:setTema, tema: tema, logedUser: logedUser, setLogedUser:setLogedUser}}>
            <PaperProvider theme={tema}>
                <SessionProvider>
                    <Slot/>
                </SessionProvider>
            </PaperProvider>
        </ThemeContext.Provider>
    );
}
