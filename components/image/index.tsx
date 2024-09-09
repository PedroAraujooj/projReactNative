import { Card } from 'react-native-paper';

export default function Image({url, ...props} : any){
    return(
    <Card {...props}>
        <Card.Cover source={{ uri: url }} />
    </Card>
    );
}