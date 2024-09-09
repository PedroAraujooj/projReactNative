import { Button as Bnt} from 'react-native-paper';

export default function Button({children, ...props} : any) {
    return(
        <Bnt {...props} mode="contained">
            {children}
        </Bnt>
    );
}