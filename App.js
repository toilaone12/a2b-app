import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const androidClientId = '187142393375-7bp1qk9479dibdaepdpj3ibeotm4pr3p.apps.googleusercontent.com';
  const webClientId = '187142393375-c2ai5ek3ap50qat3i710ucc9mirv4j2b.apps.googleusercontent.com';
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId
  });
  // mỗi lần render lại thì sẽ 
  useEffect(() => {
    if(response?.type === 'success'){
      setToken(response.authentication.accessToken);
      getUserInfo();
    }else{
      console.log("Chưa đăng nhập Google");
    }
  })
  // React.useEffect(() => {
  //   // handleSignInWithGoogle();

  // }
  // , [response])

  // async function handleSignInWithGoogle(){
  //   const user = await AsyncStorage.getItem("@user"); // lay key user
  //   if(!user){
  //     // console.log(typeof user);
  //     if(response?.type !== null){
  //       if(response?.type === 'success'){ // toan tu ? tranh truong hop null hoac la undefinded
  //         await getUserInfo(response.authentication.accessToken)
  //       }else{
  //         console.log('No response!');
  //       }
  //     }else{
  //       console.log('No response!');
  //     }
  //   }else{
  //     setUserInfo(JSON.parse(user))
  //   }
  // }

  const getUserInfo = async () => {
    try{
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me",
      {
        headers:{ Authorization: `Bearer ${token}`},
      });
      const user = await response.json();
      // await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);
    }catch (err){

    }
  }

  return (
    // <View style={styles.container}>
    //   <Text>{JSON.stringify(userInfo, null, 2)}</Text>
    //   <TouchableOpacity>
    //     <Button title='Đăng nhập bằng Google' onPress={promptAsync}></Button>
    //   </TouchableOpacity>
    //   <StatusBar style="auto" />
    // </View>
    <View style={styles.container}>
    {userInfo === null ? (
      <Button
        title="Đăng nhập bằng Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
    ) : (
      <Text style={styles.text}>{userInfo.name}</Text>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
