import {useSession} from "@/app/ctx";
import {useForm} from "react-hook-form";
import {logarUsuario, resetarSenha, Usuario} from "@/app/infra/usuario";
import {router} from "expo-router";
import {Card, Surface} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useState} from "react";
import Topbar from "@/components/navigation/topbar";
import Button from "@/components/button";
import Text from "@/components/text";
import TextInput from "@/components/textinput";

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
            <Topbar
                title="Recuperar senha"
                back={true}
                menu={true}/>
            <Card style={styles.card}>
                <Text variant={"headlineLarge"}>Recuperar senha</Text>
                <View>
                    <TextInput
                        id="email"
                        label="Email"
                        onChangeText={(text) => setValue("email", text)}
                    />
                    <Button mode="contained" onPress={handleSubmit(handleClick)}>
                        Recuperar senha
                    </Button>
                </View>
                {sucesso && ("Email de recuperação enviado")}
                {!sucesso && isSubmitted && ("Erro ao enviar email de recuperação")}
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