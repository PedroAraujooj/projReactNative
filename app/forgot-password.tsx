import {useSession} from "@/app/ctx";
import {useForm} from "react-hook-form";
import {logarUsuario, resetarSenha, Usuario} from "@/app/infra/usuario";
import {router} from "expo-router";
import {Button, Card, Surface, Text, TextInput} from "react-native-paper";
import {StyleSheet} from "react-native";
import {useState} from "react";

export default function ForgotPassword() {
    const [sucesso,setSucesso] = useState(false);
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
        let isSucesso: boolean = await resetarSenha(email);
        setSucesso(isSucesso);

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
                    <Button mode="contained" onPress={handleSubmit(handleClick)}>
                        Recuperar senha
                    </Button>
                </form>
                {sucesso && ("Email de recuperação enviado")}
                {!sucesso && isSubmitted && ("Erro ao enviar email de recuperação")}
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