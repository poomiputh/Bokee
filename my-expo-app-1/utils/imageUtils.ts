import { ImageSourcePropType } from "react-native";

const parseSource = (src?: string, useCache?: boolean): ImageSourcePropType => {
    if (src === undefined) return require("@/assets/images/react-logo.png"); // fallback

    if (typeof src === "number") {
        return src; // local require()
    } else {
        return { uri: src, cache: useCache ? "only-if-cached" : "reload" }; // remote URL
    }
};

export { parseSource };

