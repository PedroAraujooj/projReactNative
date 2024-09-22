import {rtdb} from "@/app/infra/firebase";
import {get, ref, set, update} from "@firebase/database";

const saveData = async (table, data, uid) => {
    set(ref(rtdb, `${table}/` + uid), data);
}

const updateData = async (table, data, uid) => {
    const updates = {};
    updates[`/${table}/${uid}`] = data;
    update(ref(rtdb), updates);
}

const loadData = async (table) => {
    const snapshot = await get(ref(rtdb, table));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return [];
    }
}

const getData = async (table, uid) => {
    const dbRef = ref(rtdb, `${table}/${uid}`);
    console.log(dbRef);

    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const deleteData = async (table, uid) => {
    const updates = {};
    updates[`/${table}/` + uid] = null;
    update(ref(rtdb), updates);
}

export {
    saveData,
    updateData,
    loadData,
    getData,
    deleteData
}