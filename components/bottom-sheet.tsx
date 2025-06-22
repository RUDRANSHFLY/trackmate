import React, { ReactNode } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomSheetProps{
    visible : boolean;
    onClose : () => void;
    children : ReactNode ;
}

export default function BottomSheet({ visible, onClose, children } : BottomSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
});
