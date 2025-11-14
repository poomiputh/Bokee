import AppButton from "@/components/inputs/app-button";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { View } from "react-native";

export default function Login() {
    const { login: signIn } = useSession();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppButton 
                title="Login"
                onPress={() => {
                    signIn();
                    router.replace('/');
                }}
            />
        </View>
    );
}