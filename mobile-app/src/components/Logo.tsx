import { View, Text, Image} from 'react-native';

// To use your real logo:
// 1. Save it as mobile-app/assets/images/logo.png
// 2. Add `Image` to the react-native import, then replace the placeholder
//    circle below with:
//    

export default function Logo({ size = 100 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#00000',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={require('../../assets/images/logo.png')} style={{ width: 250, height: 250 }} resizeMode="contain" />
      </View>
       
    </View>
  );
}