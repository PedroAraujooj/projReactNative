import { TextInput } from 'react-native-paper';
import {useState} from "react";

export default function Input(props : any){
    const [text, setText] = useState('');

    return(
        <TextInput
            {...props}
            value={text}
            onChangeText={text => setText(text)}
        />
    );
}