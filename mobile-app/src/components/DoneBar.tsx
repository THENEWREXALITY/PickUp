import { InputAccessoryView, View, Button, Keyboard, Platform } from 'react-native';

export const DONE_ID = 'doneBar';

export default function DoneBar() {
  if (Platform.OS !== 'ios') return null;
  return (
    <InputAccessoryView nativeID={DONE_ID}>
      <View
        style={{
          backgroundColor: '#F1F3F7',
          alignItems: 'flex-end',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderTopWidth: 1,
          borderColor: '#D0D7E2',
        }}
      >
        <Button title="Done" onPress={Keyboard.dismiss} />
      </View>
    </InputAccessoryView>
  );
}