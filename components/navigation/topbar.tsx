import {router} from "expo-router";
import {useState} from "react";
import {useSession} from "@/app/ctx";
import AppBar from "@/components/navigation/AppBar";
import Menu from "@/components/navigation/Menu";

const Topbar = (props: any) => {
    const { signOut, user,theme ,session} = useSession();
    const [visible, setVisible] = useState(false);

    return  <>
                <AppBar
                    title={`${props.title} - ${user} - ${theme} - ${session}`}
                    icon={props.menu ? "dots-vertical" : ""}
                    onPress={() => setVisible(!visible)}
                    back={props.back}
                />
                {
                    props.menu ? <Menu
                                    visible={visible}
                                    setVisible={setVisible}
                                    items={[
                                        {
                                            title: "Settings",
                                            leadingIcon: "cog",
                                            onPress: () => {
                                                router.push("/settings")
                                            }
                                        },
                                        {
                                            title: "Logout",
                                            leadingIcon: "logout",
                                            onPress: () => {
                                                signOut()
                                            }
                                        }
                                    ]}
                                    /> : null
                }
            </>
}

Topbar.defaultProps = {
    menu: true,
    back: false
}

export default Topbar;