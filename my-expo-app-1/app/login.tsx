import BottomModal from "@/components/bottom-modal";
import AppButton from "@/components/inputs/app-button";
import { AppCheckbox } from "@/components/inputs/app-checkbox";
import { AppTextInput } from "@/components/inputs/app-text-input";
import AppText from "@/components/texts/app-text";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, TextInput, View } from "react-native";

type LoginForm = {
    userIdentifier: string;
    password: string;
}

export default function Login() {
    const { login, isLoading } = useSession();
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        defaultValues: {
            userIdentifier: "",
            password: "",
        },
    })

    const passwordRef = useRef<TextInput>(null);

    const onSubmit = async (data: LoginForm) => {
        setVisible(false);
        var success = await login({
            userIdentifier: data.userIdentifier,
            password: data.password
        });
        if (!success) {
            setVisible(true);
            return;
        }
        router.replace('/');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading && <ActivityIndicator size="large" />}
            <BottomModal visible={visible} onClose={() => setVisible(false)}>
                <AppText
                    leftIcon={<Image style={{ width: 45, height: 45 }} source={require("../assets/icons/logo.png")} />}
                    leftIconMargin={15}
                    wrapperStyles={{ marginBottom: 40 }}
                    style={{ fontSize: 35, fontWeight: "bold" }}
                >
                    Log In
                </AppText>
                <Controller
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            textContentType="username"
                            autoCapitalize="none"
                            placeholder="Username or Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            value={value}
                            style={{ marginBottom: 20 }}
                        />
                    )}
                    name="userIdentifier"
                />

                <Controller
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            ref={passwordRef}
                            autoCapitalize="none"
                            textContentType="password"
                            secureTextEntry
                            placeholder="Password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{ marginBottom: 20 }}
                        />
                    )}
                    name="password"
                />

                <AppCheckbox
                    label="Keep me logged in"
                    labelMargin={10}
                    wrapperStyles={{ marginBottom: 20 }}
                />

                <AppButton
                    title="Log In"
                    onPress={handleSubmit(onSubmit)}
                />
            </BottomModal>
        </View>
    );
}

