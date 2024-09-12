import {Button, Card, HelperText, Surface, Text, TextInput, useTheme} from "react-native-paper";
import {StyleSheet, View} from 'react-native';
import {useForm} from "react-hook-form";
import {useSession} from "@/app/ctx";
import {router} from "expo-router";
import {logarUsuario, Usuario} from "@/app/infra/usuario";
import {navigate} from "expo-router/build/global-state/routing";
import {useContext} from "react";
import {ThemeContext} from "@/app/_layout";

export default function Login() {
    const {signIn} = useSession();
    const {setLogedUser, logedUser} = useContext(ThemeContext);


    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitted},
        reset,
        setValue,
    } = useForm();

    async function handleClick(data) {
        console.log(data);
        const email = data.email;
        const senha = data.senha;
        let usuario: Usuario = await logarUsuario(email, senha);
        if (usuario.id) {
            console.log(usuario);
            console.log(usuario);
            setLogedUser(usuario);
            signIn(usuario.email);
            router.replace('/');
        } else {
            alert(usuario.erro);
        }
    }

    return (
        <Surface elevation={1} style={styles.surface}>
            <Card style={styles.card}>
                <Text variant={"headlineLarge"}>Login</Text>
                <View>

                    <TextInput
                        id="email"
                        label="Email"
                        onChangeText={(text) => setValue("email", text)}
                    />


                    <TextInput
                        id="senha"
                        label="senha"
                        secureTextEntry={true}
                        autoComplete="current-password"
                        onChangeText={(text) => setValue("senha", text)}
                    />


                    <Button mode="contained" onPress={handleSubmit(handleClick)}>
                        Login
                    </Button>
                </View>
            </Card>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: '14%',
        justifyContent: 'center',
    },
    surface: {
        width: '100%',
        height: '100%',
    },
    img: {
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});