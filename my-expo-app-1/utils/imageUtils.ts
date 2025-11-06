import { ImageSourcePropType } from "react-native";

const parseSource = (src: string | undefined): ImageSourcePropType => {
    console.log(src);
    if (src === undefined) return require("@/assets/images/react-logo.png"); // fallback

    if (typeof src === "number") {
        return src; // local require()
    } else {
        return { uri: src }; // remote URL
    }
};

export { parseSource };
