import DataTable from 'react-data-table-component';

export default function ListaUsuariosTP3({ usuarios = [], setIdEmEdicao }) {
    const colunas = [
        {
            name: 'Id',
            selector: row => row.id,
            sortable: true,
            omit: true
        },
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Telefone',
            selector: row => row.telefone,
        },
    ];

    const opcoes = { rowsPerPageText: 'Linhas por página:', rangeSeparatorText: 'de' };

    function handleChange({ selectedRows }) {
        const id = selectedRows[0]?.id;
        console.log(id);
        if(id) {
            setIdEmEdicao(id);
        } else {
            setIdEmEdicao("");
        }
    }

    return (
        <DataTable
            columns={colunas}
            data={usuarios}
            pagination
            paginationPerPage={5}
            dense
            responsive
            striped
            paginationComponentOptions={opcoes}
            noDataComponent="Cadastro Vazio"
            defaultSortFieldId={1}
            selectableRows
            selectableRowsHighlight
            selectableRowsSingle
            onSelectedRowsChange={handleChange}
        />
    );
}
