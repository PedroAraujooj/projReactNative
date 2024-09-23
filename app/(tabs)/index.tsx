import React, {useContext, useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
    alterarUsuarioTP3,
    excluirUsuarioTP3,
    inserirUsuariosTP3,
    listarUsuariosTP3,
    obterUsuarioTP3
} from "@/app/infra/usuarioTP3";
import { Surface} from "react-native-paper";
import Text from "@/components/text";
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

export default function Home() {

    return (
        <Surface elevation={1} style={styles.surface}>
            <Topbar title="Home"/>
            <Text variant="headlineMedium" style={styles.textAlign}>Bem Vindo ao meu AT de Desenvolvimento Mobile com React Native!</Text>
            <Text variant="headlineMedium"> </Text>
            <Text variant="headlineSmall"style={styles.textAlign}> Nesse projeto eu desenvolvi um gerenciador financeiro, onde o usuário pode inserir seus gastos e lucros mensais e tem um total final como resultado!  </Text>
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
    },
    textAlign:{
        textAlign: "center",
    }
});