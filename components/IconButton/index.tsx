import { IconButton as OldIconButton} from 'react-native-paper';
export default function IconButton(props : any){
    return(
        <OldIconButton {...props}>
            {props.children}
        </OldIconButton>
    );
}