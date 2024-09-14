import Topbar from "@/components/navigation/topbar";
import {useSession} from "@/app/ctx";
import {Controller, useForm} from "react-hook-form";
import {Redirect, router} from "expo-router";
import { Button, Card, Surface, Text, TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import * as ImagePicker from "expo-image-picker";

import {ThemeContext} from "@/app/_layout";
import Grid from "@/components/grid";
import {UserInterface} from "@/app/infra/User";
import {insert, select, update} from "@/app/infra/database";
import Avatar from "@/components/avatar";
import Fab from "@/components/fab";
import Camera from "@/components/camera";
import {Usuario} from "@/app/infra/usuario";

export default function Profile() {
    const {setLogedUser, logedUser} = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const cameraRef = useRef(null);
    const [data, setData] = useState<Usuario>({
        photoURL: null
    });
    const getUser = async () => {
        const d = await select("usuario", ["id", "email", "nome", "telefone", "photoURL"], null, false);
        console.log("11111111111")
        console.log(d);
        setData((v) => ({
            ...v,
            ...d
        }))
        console.log("22222222222222")

        console.log(data);
    }


    useEffect(() => {
        getUser();
        console.log(data)
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
            nome: data.nome,
            telefone: data.telefone,
        });
    }, [data, reset]);


    async function handleClick(dataForm) {
        console.log("+++++++++++++++++++");
        console.log(dataForm);
        console.log(logedUser);
        const telefone = dataForm.telefone;
        const nome = dataForm.nome;
        setData((data) => ({...data, telefone: telefone, nome: nome}))
        //await alterarUsuario({...logedUser, telefone: telefone, nome: nome});
        //let novoUser = await obterUsuario(logedUser.id);
       /* id TEXT PRIMARY KEY NOT NULL,
            email TEXT NOT NULL,
            nome TEXT,
            photoURL TEXT,
            telefone TEXT,
            sync INTEGER*/
        console.log("---------------------------")
        await update('usuario',{nome: data.nome, telefone: data.telefone}, data.id );

        console.log(data);
        setLogedUser(data);
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
                            {console.log(data.photoURL)}
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