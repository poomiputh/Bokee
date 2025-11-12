import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type BaseLayoutProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ContainerProps = BaseLayoutProps & {
  fluid?: boolean;
};

type RowProps = BaseLayoutProps;

type ColProps = BaseLayoutProps & {
  span?: number | "auto";
};

const Container = ({ children, style, fluid = true }: ContainerProps) => (
  <View
    style={[
      styles.container,
      fluid && { flex: 1 },
      style,
    ]}
  >
    {children}
  </View>
);

const Row = ({ children, style }: RowProps) => (
  <View
    style={[styles.row, style]}
  >
    {children}
  </View>
);

const Col = ({ span = 12, children, style }: ColProps) => {
  const isAuto = span === "auto";
  const widthStyle: ViewStyle = isAuto
    ? { flexGrow: 0, flexShrink: 0, alignSelf: "flex-start" }
    : { width: `${(span / 12) * 100}%` as any };

  return (
    <View style={[styles.col, widthStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Optional base container styling
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  col: {
    padding: 10,
  },
});

export { Col, Container, Row };

