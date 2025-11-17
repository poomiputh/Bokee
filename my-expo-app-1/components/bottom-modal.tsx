import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomModal({ visible, onClose, children }: { visible: boolean, onClose: () => void, children: React.ReactNode }) {
    const { theme } = useAppTheme();
    const slideAnim = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = shown

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "flex-end",
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.background,
        },
        container: {
            backgroundColor: theme.colors.backgroundBackdrop,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "75%",     // ⬅️ Occupy 75% of screen height
            padding: 40,
        },
    });

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // height is 75% of screen → 0.75
    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 0], // you can also calculate by screen height
    });

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>

                {/* BACKDROP */}
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} />

                {/* BOTTOM SHEET */}
                <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                    {children}
                </Animated.View>

            </View>
        </Modal>
    );
}


