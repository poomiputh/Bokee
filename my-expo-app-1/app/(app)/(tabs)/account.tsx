import AppButton from "@/components/inputs/app-button";
import { useSession } from "@/hooks/useSession";
import { View } from "react-native";

export default function Account() {
    const { logout } = useSession();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppButton 
                title="Logout"
                onPress={logout}
            />
        </View>
    );
}