import { useAppTheme } from "@/hooks/useAppTheme";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type FullscreenModalProps = {
    children: React.ReactNode;
};

export type FullscreenModalRef = {
    open: () => void;
    close: () => void;
};

const FullscreenModal = forwardRef<FullscreenModalRef, FullscreenModalProps>(
    ({ children }, ref) => {
        const { theme } = useAppTheme();
        const [visible, setVisible] = useState(false);

        const open = () => setVisible(true);
        const close = () => setVisible(false);

        // expose open & close to parent
        useImperativeHandle(ref, () => ({
            open,
            close
        }));

        return (
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.background
                    }}
                >
                    {children}
                </SafeAreaView>
            </Modal>
        );
    }
);

export default FullscreenModal;
