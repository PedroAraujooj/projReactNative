
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import {db} from "@/app/infra/firebase";

export async function inserirUsuariosTP3(novoUsuarioTP3) {
    const docRef = await addDoc(collection(db, "usuariosTP3"), novoUsuarioTP3);
    return docRef.id;
}

export async function listarUsuariosTP3() {
    let retorno;
    await getDocs(collection(db, "usuariosTP3"))
        .then((querySnapshot) => {
            retorno = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        });
    return retorno;
}

export async function obterUsuarioTP3(id) {
    const docRef = doc(db, "usuariosTP3", id);
    const docSnap = await getDoc(docRef);
    return {...docSnap.data(), id: doc.id};
}

export async function excluirUsuarioTP3(id) {
    await deleteDoc(doc(db, "usuariosTP3", id));
}

export async function alterarUsuarioTP3(usuarioTP3, id) {
    await setDoc(doc(db, "usuariosTP3", id), usuarioTP3);
}