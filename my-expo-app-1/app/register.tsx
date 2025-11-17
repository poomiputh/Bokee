import BottomModal from "@/components/bottom-modal";
import AppText from "@/components/texts/app-text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";

export default function Register() {
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <BottomModal visible={visible} onClose={() => setVisible(false)}>
                <AppText
                    leftIcon={<Image style={{ width: 45, height: 45 }} source={require("../assets/icons/logo.png")} />}
                    leftIconMargin={15}
                    wrapperStyles={{ marginBottom: 40 }}
                    style={{ fontSize: 35, fontWeight: "bold" }}
                >
                    Sign Up
                </AppText>
            </BottomModal>
        </View>
    );
}