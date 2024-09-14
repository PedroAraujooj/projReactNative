import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useRef, useState} from "react";
import {ScrollView} from "react-native";
import {useTheme} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import {drop, insert, select, update} from "@/app/infra/database";
import Grid from "@/components/grid";
import Topbar from "@/components/navigation/topbar";
import IconButton from "@/components/IconButton";
import Card from "@/components/card";
import Button from "@/components/button";
import Dialog from "@/components/dialog";
import Camera from "@/components/camera";
import Snackbar from "@/components/snackBar";
import TextInput from "@/components/textinput";
import Text from "@/components/text";

export default function FormScreen() {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [data, setData] = useState({
        id: null,
        title: null,
        description: null,
        images: []
    });

    const [cameraVisible, setCameraVisible] = useState(false);
    const [messageText, setMessageText] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(null);
    const cameraRef = useRef(null);

    const onCapture = (photo: any) => {
        const images = data.images;
        images.push(photo.uri);
        updateImages(images);
    }

    useEffect(() => {
        loadData();
    }, []);

    const _update = async () => {
        setLoading(true);

        try{
            let id = data.id

            if (id) {
                await update('item', {
                    title: data.title,
                    description: data.description,
                }, id)

                await drop("item_image", `itemId='${id}'`)
                for(let image of data.images){
                    await insert('item_image', {
                        image: image,
                        itemId: id
                    })
                }
            }else {
                id = await insert('item', {
                    title: data.title,
                    description: data.description,
                })

                if(data.images?.length > 0){
                    for(let image of data.images){
                        await insert('item_image', {
                            image: image,
                            itemId: id
                        })
                    }
                }
            }
            setMessageText(data.id ? "Dado atualizado com sucesso!!!" : "Dado criado com sucesso!!!");
            setTimeout(() => {
                router.back();
            }, 2000);
        }catch (err){
            console.log(err)
            setMessageText(data.id ? "Um erro ocorreu ao atualizar o dado.": "Um erro ocorreu ao criar o dado.")
        }

        setLoading(false);
    }

    const loadData = async () => {
        if(params.id){
            const d = await select("item", [ "id", "title", "description", "createdAt", "sync"], `id='${params.id}'`, false);
            const images: Array = await select("item_image", [ "id", "image", "itemId", "createdAt", "sync"], `itemId='${params.id}'`, true);

            console.log(images)
            setData((v: any) => ({
                ...v,
                ...d,
                images: images.map(image => image.image),
                id: params.id,
            }));
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        setLoading(true);

        if (!result.canceled) {
            const images = data.images;
            result.assets.forEach((image: any) => {
                images.push(image.uri);
            })
            updateImages(images);
        }
        setLoading(false);
    };

    const updateImages = (images: string[]) => {
        setData((v: any) => ({...v, images: images}));
    }

    return <Grid style={{
        height: '100%',
        width: '100%',
    }}>
        <Grid>
            <Topbar title="Novo item" back={true} menu={false}/>
        </Grid>
        <Grid style={{
            ...styles.padding
        }}>
            <Text variant="headlineLarge">{ data && data.id ? "Editar item" : "Cadastrar item" }</Text>
        </Grid>
        <ScrollView>
            <Grid style={{
                ...styles.padding
            }}>
                <TextInput
                    label="Título"
                    value={data.title}
                    onChangeText={(text) => setData((v: any) => ({...v, title: text}))}
                />
            </Grid>
            <Grid style={{
                ...styles.padding
            }}>
                <TextInput
                    label="Descrição"
                    multiline={true}
                    numberOfLines={6}
                    value={data.description}
                    onChangeText={(text) => setData((v: any) => ({...v, description: text}))}
                />
            </Grid>
            <Grid style={{
                ...styles.padding
            }}>
                <Text variant="headlineSmall">Galeria</Text>
            </Grid>
            <Grid style={{
                ...styles.padding,
                paddingTop: 0,
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>
                {
                    loading ?
                        <Text>Carregando...</Text>
                        : data.images.map((image: string, index: number) => {

                            return <Grid key={index}
                                         style={{
                                             width: '33.33%',
                                             height: 100,
                                             padding: 5,
                                             position: 'relative'
                                         }}>
                                <Card
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 2,
                                    }}
                                    source={{ uri: image }}/>
                                <IconButton
                                    icon={"close"}
                                    onPress={() => {
                                        setDialogVisible(true);
                                        setImageToDelete(index);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: -15,
                                        right: -15,
                                        zIndex: 3,
                                        backgroundColor: "#fff",
                                    }}/>
                            </Grid>
                        })
                }
            </Grid>
            <Grid style={{
                ...styles.padding,
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Grid style={{
                    ...styles.padding,
                    width: '50%'
                }}>
                    <Button
                        style={{
                            borderRadius: 0,
                            backgroundColor: theme.colors.onTertiaryContainer
                        }}
                        icon="camera"
                        mode="contained"
                        onPress={() => setCameraVisible(true)}>
                        Tirar foto
                    </Button>
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    width: '50%'
                }}>
                    <Button
                        style={{
                            borderRadius: 0,
                            backgroundColor: theme.colors.onSecondaryContainer
                        }}
                        icon="image"
                        mode="contained"
                        onPress={pickImage}>
                        Galeria
                    </Button>
                </Grid>
            </Grid>
            <Grid style={{
                ...styles.padding
            }}>
                <Button
                    style={{
                        borderRadius: 0
                    }}
                    mode="contained"
                    onPress={_update}>
                    {data && data.id ? "Editar" : "Cadastrar"}
                </Button>
            </Grid>
        </ScrollView>
        <Dialog
            icon={"alert"}
            title={"Excluir imagem"}
            text={"Deseja realmente excluir esta imagem?"}
            visible={dialogVisible}
            setVisibility={setDialogVisible}
            onDismiss={() => setDialogVisible(false)}
            actions={[
                {
                    text: "Cancelar",
                    onPress: () => {
                        setDialogVisible(false);
                        setImageToDelete(null);
                        setMessageText("Ação cancelada");
                    }
                },
                {
                    text: "Excluir",
                    onPress: () => {
                        const images = data.images;
                        images.splice(imageToDelete, 1);
                        updateImages(images);
                        setImageToDelete(null);
                        setMessageText("Imagem excluída com sucesso!");
                        setDialogVisible(false);
                    }
                }
            ]}
        />
        {
            cameraVisible ? <Camera
                onCapture={onCapture}
                setCameraVisible={setCameraVisible}
                ref={cameraRef}
            /> : null
        }
        <Snackbar
            visible={messageText !== null}
            onDismiss={() => setMessageText(null)}
            text={messageText} />
    </Grid>;
}

const styles = {
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    padding: {
        padding: 16
    },
}
