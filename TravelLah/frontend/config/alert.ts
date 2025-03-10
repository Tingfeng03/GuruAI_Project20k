import { Alert, Platform, AlertButton, AlertOptions } from "react-native";

const alertPolyfill = (
  title: string,
  message?: string | null,
  buttons?: AlertButton[] | null,
  options?: AlertOptions,
  type?: string
): void => {
  if (!buttons || buttons.length === 0) {
    window.alert([title, message].filter(Boolean).join("\n"));
    return;
  }

  // Use window.confirm to mimic a two-button alert.
  const result = window.confirm([title, message].filter(Boolean).join("\n"));
  if (result) {
    const confirmButton = buttons.find((btn) => btn.style !== "cancel");
    confirmButton && confirmButton.onPress && confirmButton.onPress();
  } else {
    const cancelButton = buttons.find((btn) => btn.style === "cancel");
    cancelButton && cancelButton.onPress && cancelButton.onPress();
  }
};

const customAlert =
  Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default customAlert;
