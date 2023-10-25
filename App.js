import 'react-native-gesture-handler';
import { ActivityIndicator,View } from "react-native";
import MainRoute from "./route/index";
import Constants from "expo-constants";
import { useFonts } from 'expo-font';
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';


const theme = {
  ...DefaultTheme,
  roundness: 12,
  version: 3,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1f1f1f",
    accent: "#84a59d",
    light: "#fff",
  },
};

export default function App() {

  let [fontsLoaded] = useFonts({
    PoppinsBold: require('./assets/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./assets/Poppins-SemiBold.ttf'),
    PoppinsMedium: require('./assets/Poppins-Medium.ttf'),
    PoppinsLight: require('./assets/Poppins-Light.ttf'),
  });


  if (!fontsLoaded) {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <ActivityIndicator color={'black'} size={'large'}/>
      </View>
    );
  } 

  else {
    return (
      <PaperProvider theme={theme}>
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <StatusBar style="dark" />
          <MainRoute />
        </View>
      </PaperProvider>
    );
  }
}