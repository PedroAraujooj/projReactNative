import { List as OldList } from 'react-native-paper';
export default function List({title, ...props} : any){
    return(
        <OldList.Section {...props}>
            <OldList.Subheader>{title}</OldList.Subheader>
            {props.children}
        </OldList.Section>
    );
}