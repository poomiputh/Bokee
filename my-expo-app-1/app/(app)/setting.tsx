import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSession } from "@/hooks/useSession";
import { useState } from "react";
import { StyleSheet, Switch } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Setting() {
  const { theme } = useAppTheme();
  const { logout } = useSession();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const styles = StyleSheet.create({
    titleHeader: {
      fontSize: 20,
    },
    titleHeader2: {
      fontSize: 15,
    },
    selected: {
      fontSize: 14,
      color: theme.colors.textDescription
    }
  });

  return (
    <ScrollView>
      <Container style={{ padding: 15 }}>

        {/* General */}
        <Row style={{ justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.colors.textDescription, marginBottom: 10}}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader}>
              General
            </AppText>
          </Col>
        </Row>

        <Row style={{ justifyContent: "space-between" }}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader2}>
              Read mode
            </AppText>
          </Col>
          <Col span={"auto"}>
            <AppText style={styles.selected}>
              Left to right
            </AppText>
          </Col>
        </Row>

        <Row style={{ justifyContent: "space-between" }}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader2}>
              Use swipe page gesture
            </AppText>
          </Col>
          <Col span={"auto"}>
            <AppText style={styles.selected}>
              <Switch
                // trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? theme.colors.primary : '#f4f3f4'}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </AppText>
          </Col>
        </Row>

        {/* Help */}
        <Row style={{ justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.colors.textDescription, marginBottom: 10}}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader}>
              Help
            </AppText>
          </Col>
        </Row>

        {/* Send feedback */}
        <Row style={{ justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.colors.textDescription, marginBottom: 10}}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader}>
              Send feedback
            </AppText>
          </Col>
        </Row>

        {/* Terms of Service */}
        <Row style={{ justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.colors.textDescription, marginBottom: 10}}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader}>
              Terms of Service
            </AppText>
          </Col>
        </Row>

        {/* About */}
        <Row style={{ justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.colors.textDescription, marginBottom: 10}}>
          <Col span={"auto"}>
            <AppText style={styles.titleHeader}>
              About
            </AppText>
          </Col>
        </Row>

      </Container>
    </ScrollView>
  );
}