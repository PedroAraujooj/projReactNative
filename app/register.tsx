import {useSession} from "@/app/ctx";
import {useForm} from "react-hook-form";
import {criarConta, logarUsuario, Usuario} from "@/app/infra/usuario";
import {router} from "expo-router";
import {Button, Card, Surface, Text, TextInput} from "react-native-paper";
import {StyleSheet} from "react-native";
import {useContext} from "react";
import {ThemeContext} from "@/app/_layout";

export default function Register() {
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
        const confirma = data.confirma;
        if (senha === confirma) {
            let usuario:Usuario = await criarConta(email, senha);
            if (usuario.id) {
                setLogedUser(usuario);
                signIn(usuario.email);
                router.replace('/');
                alert(`SUCESSO, logado com ${usuario.email}`);
            } else {
                alert(`ERRO: ${usuario.erro}`);
            }
        } else {
            alert(`ERRO: senhas incompativeis`);

        }
    }

    return (
        <Surface elevation={1} style={styles.surface}>
            <Card style={styles.card}>
                <Text variant={"headlineLarge"}>Login</Text>
                <form>
                    <br/>
                    <TextInput
                        id="email"
                        label="Email"
                        onChangeText={(text) => setValue("email", text)}
                    />
                    <br/>
                    <br/>
                    <TextInput
                        id="senha"
                        label="senha"
                        secureTextEntry={true}
                        onChangeText={(text) => setValue("senha", text)}
                    />
                    <br/>
                    <br/>
                    <TextInput
                        id="confirma"
                        label="confirma"
                        secureTextEntry={true}
                        onChangeText={(text) => setValue("confirma", text)}
                    />
                    <br/>
                    <br/>
                    <Button mode="contained" onPress={handleSubmit(handleClick)}>
                        Login
                    </Button>
                </form>
            </Card>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 8,
        marginTop: '14%',
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: '70%',
        width: '70%',
        alignItems: 'center',
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

