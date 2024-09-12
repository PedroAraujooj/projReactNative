import React, {useContext, useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
    alterarUsuarioTP3,
    excluirUsuarioTP3,
    inserirUsuariosTP3,
    listarUsuariosTP3,
    obterUsuarioTP3
} from "@/app/infra/usuarioTP3";
import {Button, Card, Surface, Text, TextInput} from "react-native-paper";
import ListaUsuariosTP3 from "@/components/listaUsuariosTP3";
import {ThemeContext} from "@/app/_layout";
import {UserInterface} from "@/app/infra/User";
import {select} from "@/app/infra/database";
import * as ImagePicker from "expo-image-picker";
import {alterarUsuario, obterUsuario} from "@/app/infra/usuario";
import Grid from "@/components/grid";
import Avatar from "@/components/avatar";
import Fab from "@/components/fab";
import Camera from "@/components/camera";
import {StyleSheet, View} from "react-native";
import Topbar from "@/components/navigation/topbar";

export default function Dashboard() {
    const [usuarios, setUsuarios] = useState([{id:1},{id:4}]);
    const [idEmEdicao, setIdEmEdicao] = useState("");
    const {
        control,
        register,
        handleSubmit,
        formState: {errors, isSubmitted},
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            email: "",
            nome: "",
            telefone: ""
        }
    });

    useEffect(() => {
        async function fetchData() {
            const novaLista = await listarUsuariosTP3();
            setUsuarios(novaLista);
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Quando idEmEdicao mudar, buscar o usuário e definir valores iniciais
        if (idEmEdicao) {
            obterUsuarioTP3(idEmEdicao).then((user) => {
                if (user) {
                    setValue("email", user.email);
                    setValue("nome", user.nome);
                    setValue("telefone", user.telefone);
                }
            });
        } else {
            reset(); // Resetar os campos quando não há id em edição
        }
    }, [idEmEdicao, setValue, reset]);

    async function handleExcluir() {
        console.log(idEmEdicao);
        await excluirUsuarioTP3(idEmEdicao);
        setIdEmEdicao("");
    }

    async function handleClick(dados) {
        if (errors.nome || errors.telefone || errors.email) {
            alert(`Erro em nome: ${errors.nome ? errors.nome.message : "Não há erros"}; \n Erro em telefone: ${errors.telefone ? errors.telefone.message : "Não há erros"} \n
            Erro em email: ${errors.email ? errors.email.message : "Não há erros"}`)
        } else {
            if (idEmEdicao) {
                await alterarUsuarioTP3(dados, idEmEdicao);
                const user = await obterUsuarioTP3(idEmEdicao);
                alert(`SUCESSO \n Nome: ${user.nome}; telefone: ${user.telefone}; email: ${user.email}`);
                setIdEmEdicao("");
            } else {
                let id = await inserirUsuariosTP3(dados);
                if (id) {
                    alert(`SUCESSO \n Nome: ${dados.nome}; telefone: ${dados.telefone}; email: ${dados.email}`);
                    let novaLista = await listarUsuariosTP3();
                    setUsuarios(novaLista);
                } else {
                    alert("ERRO");
                }
                setIdEmEdicao(id);
            }


        }
    }

    return (
        <Surface elevation={1} style={styles.surface}>
            <Topbar title="Dashboard de clientes"/>

            <Card style={styles.card}>
                <Text variant={"headlineLarge"} style={styles.titulo}>Clientes guardados</Text>
                <View>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Email"
                                value={value}
                                onChangeText={onChange}
                                error={!!errors.email}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Nome"
                                value={value}
                                onChangeText={onChange}
                                error={!!errors.nome}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="telefone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Telefone"
                                value={value}
                                onChangeText={onChange}
                                error={!!errors.telefone}
                            />
                        )}
                    />

                    {/*<Button mode={"contained"}  onPress={handleSubmit(handleClick)}>{idEmEdicao? "ALTERAR":"INSERIR"}</Button>
                    <Button mode={"contained"}  onPress={handleExcluir}>EXCLUIR</Button>*/}

                </View>
            </Card>

        </Surface>

    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: '5%',
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: '60%',
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    surface: {
        width: '100%',
        height: '100%',
    },
    titulo: {
        textAlign: "center",
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    padding: {
        padding: 16
    },
    containerCenterImage: {
        width: 230,
        position: 'relative',
    },
    fab: {
        bottom: 0,
        position: 'absolute',
        borderRadius: 200
    },
    right: {
        right: 0,
    },
    left: {
        left: 0
    }
});