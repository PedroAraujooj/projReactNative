import { Card as OldCard} from 'react-native-paper';
export default function Card(props : any){
    return(
        <OldCard {...props}>
            {props.children}
        </OldCard>
    );
}