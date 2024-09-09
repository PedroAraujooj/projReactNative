import { Snackbar  as OldSnackbar} from 'react-native-paper';
export default function Snackbar(props : any){
    return(
        <OldSnackbar {...props}>
            {props.children}
        </OldSnackbar>
    );
}