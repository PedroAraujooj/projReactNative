import {useSession} from "@/app/ctx";
import {useForm} from "react-hook-form";
import {criarConta, logarUsuario, Usuario} from "@/app/infra/usuario";
import {router} from "expo-router";
import {Card, Surface} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useContext} from "react";
import {ThemeContext} from "@/app/_layout";
import Topbar from "@/components/navigation/topbar";
import Text from "@/components/text";
import TextInput from "@/components/textinput";
import Button from "@/components/button";

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
            <Topbar
                title="Criar Conta"
                back={true}
                menu={true}/>
            <Card style={styles.card}>
                <Text variant={"headlineLarge"}>Criar Conta</Text>
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
                        onChangeText={(text) => setValue("senha", text)}
                    />
                    <TextInput
                        id="confirma"
                        label="confirma"
                        secureTextEntry={true}
                        onChangeText={(text) => setValue("confirma", text)}
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
        textAlign: "center"
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

