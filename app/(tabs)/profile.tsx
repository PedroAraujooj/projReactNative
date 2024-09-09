import Topbar from "@/components/navigation/topbar";
import {useSession} from "@/app/ctx";
import {Controller, useForm} from "react-hook-form";
import {alterarUsuario, logarUsuario, obterUsuario, Usuario} from "@/app/infra/usuario";
import {Redirect, router} from "expo-router";
import { Button, Card, Surface, Text, TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import * as ImagePicker from "expo-image-picker";

import {ThemeContext} from "@/app/_layout";
import Grid from "@/components/grid";
import {UserInterface} from "@/app/infra/User";
import {select} from "@/app/infra/database";
import Avatar from "@/components/avatar";
import Fab from "@/components/fab";
import Camera from "@/components/camera";

export default function Profile() {
    const {setLogedUser, logedUser} = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const cameraRef = useRef(null);
    const [data, setData] = useState<UserInterface>({
        photoURL: null
    });
    const getUser = async () => {
        const d = await select("usuario", ["id", "email", "nome", "telefone", "photoURL", "phoneNumber"], null, false);
        setData((v) => ({
            ...v,
            ...d
        }))
    }


    useEffect(() => {
        getUser();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });
        setLoading(true);

        if (!result.canceled) {
            setData((v: any) => ({
                ...v,
                photoURL: result.assets[0].uri
            }));
        }

        setLoading(false);
    };

    const onCapture = (photo: any) => {
        setData((v: any) => ({
            ...v,
            image: photo.uri
        }));
    }

    const {
        control,
        register,
        handleSubmit,
        formState: {errors, isSubmitted},
        reset,
        setValue,
    } = useForm();

    useEffect(() => {
        reset({
            nome: logedUser.nome,
            telefone: logedUser.telefone,
        });
    }, [logedUser, reset]);


    async function handleClick(data) {
        console.log(data);
        console.log(logedUser);
        const telefone = data.telefone;
        const nome = data.nome;
        await alterarUsuario({...logedUser, telefone: telefone, nome: nome});
        let novoUser = await obterUsuario(logedUser.id);
        console.log(novoUser);
        setLogedUser(novoUser);
    }

    return (
        <Surface elevation={1} style={styles.surface}>
            <Topbar title="Perfil"/>

            <Card style={styles.card}>
                <Text variant={"headlineLarge"} style={styles.titulo}>Perfil</Text>
                <Grid>
                    <Grid style={{
                        ...styles.containerImage
                    }}>
                        <Grid style={{
                            ...styles.containerCenterImage
                        }}>
                            {
                                data.photoURL ? <Avatar size={230} source={{uri: data.photoURL}} /> : <Avatar size={230} icon="account" />
                            }
                            <Fab
                                onPress={pickImage}
                                icon="image"
                                style={{
                                    ...styles.fab,
                                    ...styles.left
                                }}/>
                            <Fab
                                onPress={() => setCameraVisible(true)}
                                icon="camera"
                                style={{
                                    ...styles.fab,
                                    ...styles.right
                                }}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Text variant="bodyMedium">(O Email {logedUser.email} não pode ser alterado)</Text>
                <View>
                    
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
                    
                    <Button mode="contained" onPress={handleSubmit(handleClick)}>
                        Atualizar
                    </Button>
                </View>
                {
                    cameraVisible ? <Camera
                        onCapture={onCapture}
                        setCameraVisible={setCameraVisible}
                        ref={cameraRef}
                    /> : null
                }
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