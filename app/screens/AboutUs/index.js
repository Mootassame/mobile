// import React, { useState, useEffect } from 'react';
// import { View, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid, FlatList } from 'react-native';
// import { BaseStyle, useTheme,authAxios } from '@config';
// import { Header, SafeAreaView, TextInput, Icon, Text, Button, Image, ListThumbCircle } from '@components';
// import { useTranslation } from 'react-i18next';
// import styles from './styles';
// import DocumentPicker from 'react-native-document-picker';

// import { useSelector, useDispatch } from 'react-redux';
// import { MediaActions } from '@actions';



// export default function Coupons({ route, navigation }) {
//   const dispatch = useDispatch();

//   const { colors } = useTheme();
//   const { t } = useTranslation();
//   const offsetKeyboard = Platform.select({
//     ios: 0,
//     android: 20,
//   });
//   const [file ,setFile]=useState(''); 
// const [storage] = useState({ 
// folder:"tenant/:tenantId/informations/images", 
// id:"informationsImages", 
// maxSizeInBytes: 140857600
// }
// )


// useEffect(() => getData(), []);



// getData = () => {

//     authAxios.get('/tenant/60a6837c57b965001ed6ec2e/file/credentials',{params:{
//     filename : file.name,
//     storageId:storage.id
//   }}).then(res => {

//     const url = res.data.uploadCredentials.url;
//     const formData = new FormData();     
//     for (const [key, value] of Object.entries(
//       res.data.uploadCredentials.fields || {},
//     )) {
//     formData.append(key, value);
//     }
//    formData.append('file', file); 
//      return authAxios.post(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }).then(res=> {console.log(res.data);});
//   }).catch((error) => { 
//     console.error(error);
//     Alert.alert(
//       "Sorry Something went wrong. Please try again",
//       error.message,
//       [
//         // {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
//         { text: "Try again", onPress: this.getData },
//       ],
//       { cancelable: false }
//     );
//   })
// };



 
//   const [loading, setLoading] = useState(false);


//   pickFiles = async () => {
//        try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//         //There can me more options as well
//         // DocumentPicker.types.allFiles
//         // DocumentPicker.types.images
//         // DocumentPicker.types.plainText
//         // DocumentPicker.types.audio
//         // DocumentPicker.types.pdf
//       });
//       //Printing the log realted to the file
//       setFile(res)
     
//       // console.log('URI : ' + res.uri);
//       // console.log('Type : ' + res.type);
//       // console.log('File Name : ' + res.name);
//       // console.log('File Size : ' + res.size);
//       //Setting the state to show single file attributes
//       // this.setState({ singleFile: res });
//     } catch (err) {
//       //Handling any exception (If any)
//       if (DocumentPicker.isCancel(err)) {
//         //If user canceled the document selection
//         alert('Canceled from single doc picker');
//       } else {
//         //For Unknown Error
//         alert('Unknown Error: ' + JSON.stringify(err));
//         throw err;
//       }
//     }

   
  
//   }
 


  
   
//     // console.log(storage.id);




//   return (
//     <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
//       <Header
//         title='Choisir un fichier'
//         renderLeft={() => {
//           return (
//             <Icon
//               name="arrow-left"
//               size={20}
//               color={colors.primary}
//               enableRTL={true}
//             />
//           );
//         }}
//         renderRight={() => {
//           return (
//             <Icon
//               name="redo-alt"
//               size={20}
//               color={colors.primary}
//               enableRTL={true}
//             />
//           );
//         }}
//         onPressLeft={() => {
//           navigation.goBack();
//         }}
      
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'android' ? 'height' : 'padding'}
//         keyboardVerticalOffset={offsetKeyboard}
//         style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>


//           <View>
//             <Button
//               full
//               style={styles.button}
//               onPress={() => this.pickFiles()}
//             >
//               Choisir
//               </Button>

//           </View>
         

//         </ScrollView>
//         <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
//           <Button
//             loading={loading}
//             full
//             onPress={() => {
//             //  navigation.navigate("OpenFile")
//             }}>
//             Ajouter
//           </Button>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
