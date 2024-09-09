import {DataTable} from "react-native-paper";

export default function DataTable2(props?: any) {
    return(
        <DataTable {...props}>{props.children}</DataTable>
    );
}