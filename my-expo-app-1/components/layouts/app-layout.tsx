
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type BaseLayoutProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

type ContainerProps = BaseLayoutProps & {
  fluid?: boolean;
}

type RowProps = BaseLayoutProps;

type ColProps = BaseLayoutProps & {
  span?: number;
}

const Container = ({ children, style, fluid = true }: ContainerProps) => (
  <View
    style={[
      styles.container,
      { flex: fluid ? 1 : undefined },
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
  const widthPercent = (span / 12) * 100;
  return (
    <View
      style={[
        styles.col,
        { width: `${widthPercent}%` }
        , style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  col: {
    padding: 10,
  },
});

export { Col, Container, Row };

