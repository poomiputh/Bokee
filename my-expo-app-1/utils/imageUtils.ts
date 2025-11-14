import { axiosClient } from "@/api/axios-client/axios-client";
import { ImageSourcePropType } from "react-native";

const parseSource = (src?: string, useCache?: boolean): ImageSourcePropType => {
    if (src === undefined) return require("@/assets/images/react-logo.png"); // fallback

    if (typeof src === "number") {
        return src; // local require()
    } else {
        // return { uri: src, cache: useCache ? "only-if-cached" : "reload" }; // remote URL
        return {
            uri: src,
            headers: {
                Authorization: axiosClient.defaults.headers.common['Authorization']?.toString() ?? ""
            }
        }; // remote URL
    }
};

export { parseSource };

