import {Tabs} from "expo-router";

export default function Tab(props : any){
    return(
        <Tabs {...props}>
            {props.children}
        </Tabs>
    );
}