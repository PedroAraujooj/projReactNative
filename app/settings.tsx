import Topbar from "@/components/navigation/topbar";
import {useColorScheme, View} from "react-native";
import {useContext} from "react";
import {ThemeContext} from "@/app/_layout";
import {Button} from "react-native-paper";
import {darkTheme, lightTheme} from "@/constants/Theme";
import {useSession} from "@/app/ctx";

export default function Settings() {
    const { changeTheme } = useSession();
    const {setTema, tema} = useContext(ThemeContext);
    console.log(setTema);
    console.log(tema);
    return (
        <View>
            <Topbar
                title="Configurações"
                back={true}
                menu={false}/>
            <Button onPress={() => {
                setTema(tema.colors.background == "rgb(29, 27, 22)"? lightTheme:darkTheme);
                changeTheme(tema.colors.background == "rgb(29, 27, 22)"? "light":"dark");
            }}>Mudar tema</Button>

        </View>

    );
}