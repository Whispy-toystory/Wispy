import { Pressable, Text } from 'react-native';

function PrimaryButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
  );
}

export default PrimaryButton;
