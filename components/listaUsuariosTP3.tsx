import { DataTable } from 'react-native-paper';
import React from "react";

export default function ListaUsuariosTP3({ usuarios = [], setIdEmEdicao }) {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, usuarios.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    function handleChange(id : number) {
        console.log(id);
        if(id) {
            setIdEmEdicao(id);
        } else {
            setIdEmEdicao("");
        }
    }

    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Nome</DataTable.Title>
                <DataTable.Title >Email</DataTable.Title>
                <DataTable.Title >Telefone</DataTable.Title>
            </DataTable.Header>

            {usuarios.slice(from, to).map((item) => (
                <DataTable.Row key={item.id} onPress={() =>handleChange(item.id)}>
                    <DataTable.Cell>{item.nome?item.nome:"xxx"}</DataTable.Cell>
                    <DataTable.Cell >{item.email?item.email:"xxx"}</DataTable.Cell>
                    <DataTable.Cell >{item.telefone?item.telefone:"xxx"}</DataTable.Cell>
                </DataTable.Row>
            ))}

            <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(usuarios.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${usuarios.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
            />
        </DataTable>
    );
}
