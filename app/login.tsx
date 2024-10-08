import {Card, HelperText, Surface, useTheme} from "react-native-paper";
import {StyleSheet, View} from 'react-native';
import {useForm} from "react-hook-form";
import {useSession} from "@/app/ctx";
import {Link, router} from "expo-router";
import {logarUsuario, Usuario} from "@/app/infra/usuario";
import {navigate} from "expo-router/build/global-state/routing";
import {useContext} from "react";
import {ThemeContext} from "@/app/_layout";
import {insert, populateDatabase, select} from "@/app/infra/database";
import Grid from "@/components/grid";
import TextInput from "@/components/textinput";
import Text from "@/components/text";
import Button from "@/components/button";

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
            const d = await select("usuario", ["id", "email", "nome", "telefone", "photoURL"], null, false);
            if (d == null) {
                await insert('usuario', {
                    id: usuario.id, email: usuario.email,
                    nome: usuario.nome, telefone: usuario.telefone
                });
            }else{
                await populateDatabase(d.id);
            }
            router.replace('/');


        } else {
            alert(usuario.erro);
        }
    }

    return (
        <Surface elevation={1} style={styles.surface}>
            <Card style={styles.card}>
                <Text variant={"headlineLarge"}>Login</Text>
                <Text variant={"bodySmall"}>(Usar: pedro@gmail.com, senha: 258348)</Text>
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
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center'
                }}>
                    {/*@ts-ignore*/}
                    <Link href="/register">
                        Criar conta
                    </Link>
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center'
                }}>
                    {/*@ts-ignore*/}
                    <Link href="/forgot-password">
                        Esqueci minha senha
                    </Link>
                </Grid>
            </Card>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: '14%',
        textAlign: "center"
    },
    surface: {
        width: '100%',
        height: '100%',
    },
    img: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    padding: {
        padding: 16,
    }

});