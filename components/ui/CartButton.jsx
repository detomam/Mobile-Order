import { View, StyleSheet, Pressable} from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function CartButton(){
    const router = useRouter();

    return (    
        <Pressable style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.cartButtonPressed,]}
            onPress={() => router.push('/(tabs)/cart')}>
            <Ionicons name={"cart"} color={'white'} size={30}/>
        </Pressable>
    
)}

const styles = StyleSheet.create({
    cartButton: {
        backgroundColor: '#881c1c',
        paddingVertical: 15,
        borderRadius: 100,
        marginHorizontal: 17,
        width: '15%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    
      cartButtonPressed: {
        transform: [{ scale: 0.95 }],
      },
})

