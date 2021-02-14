/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Linking,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
} from 'react-native';

import {CameraKitCameraScreen} from 'react-native-camera-kit';

const App = () => {
  const[qrvalue, setQrvalue] = useState('');
  const[opneScanner, setOpneScanner] = useState(false);

  const onOpenLink = () =>{
    Linking.openURL(qrvalue);
  };

  const onBarcodeScan = (qrvalue) =>{
    setQrvalue(qrvalue);
    setOpneScanner(false);
  };

  const onOpneScanner = () =>{
    //Inicio do scanneamento
    if(Platform.OS === 'android'){
      async function requestCameraPermission(){
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //verifica se ha permissão para o uso da camera.
            setQrvalue('');
            setOpneScanner(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (error) {
          alert('Erro de permissão ', error)
          console.warn(error);
        }
      }
      requestCameraPermission();
    }else{
      setQrvalue('');
      setOpneScanner(true);
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}} >
        {opneScanner?(
          <View>
            <CameraKitCameraScreen 
              ShowFrame={true}
              //Mostra/esconde o frame de escaneamento.
              scanBarcode={true}
              //Ativa a leitura de código de barras
              laserColor={'red'}
              //Cor pode ser para o laser
              frameColor={'yellow'}
              //Se o frame estiver marcado como visivel aparecerá na cor amarela.
              colorForScannerFrame={'black'}
              //Cor do escaneamento do frame
              onReadCode={(event)=>{
                onBarcodeScan(event.nativeEvent.codeStringValue)
              }}
            />
          </View>
        ):(
          <View style={styles.container}>
            <Text style={styles.titleText}>
              Barcode and QR Code Scanner using Camera in React Native
            </Text>
            <Text style={styles.textStyle}>
              {qrvalue ? 'Scanned Result: '+ qrvalue: ''}
            </Text>
            {qrvalue.includes('https://') ||
            qrvalue.includes('http://') ||
            qrvalue.includes('geo:') ? (
              <TouchableHighlight style={styles.buttonStyle} onPress={onOpenLink}>
                <Text style={styles.textLinkStyle}>
                  {
                    qrvalue.includes('geo:') ?
                    'Open in Map': 'Open Link'
                  }
                </Text>
              </TouchableHighlight>
            ):null}
            <TouchableHighlight
              onPress={onOpneScanner}
              style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>
                  Open QR Scanner
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },

  titleText:{
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  textStyle:{
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },

  buttonStyle:{
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
    paddingBottom: 15,
    paddingTop: 10,
    marginTop: 20,
  },

  buttonTextStyle:{
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },

  textLinkStyle:{
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default App;
