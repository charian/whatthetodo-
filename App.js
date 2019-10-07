import React, {Fragment, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Loading from './Loading';

import firebase from 'react-native-firebase';
import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation-stack';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notiPermission: false,
      //isAuthenticated: true,
    };
  }

  componentDidMount = () => {
    this.checkPermission();
    this.messageListener();
    //this.checkAuth();
  };

  // checkAuth = () => {
  //   firebase
  //     .auth()
  //     .signInAnonymously()
  //     .then(() => {
  //       this.setState({
  //         isAuthenticated: true,
  //       });
  //     });
  // };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
      console.log('You are granted allow notification');
    } else {
      this.requestPermission();
      console.log('You are not granted allow notification');
    }
  };

  getFcmToken = async () => {
    firebase.messaging().subscribeToTopic('wttAllUser');
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('Your fcm Token is : ' + fcmToken);
      //this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  messageListener = async () => {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        this.showAlert(title, body);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log(notificationOpen);
        const {title, body} = notificationOpen.notification;
        this.showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log(notificationOpen);
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };
  writeUserData = (email, fname, lname) => {
    firebase
      .database()
      .ref('Users/')
      .set({
        email,
        fname,
        lname,
      })
      .then(data => {
        //success callback
        console.log('data ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  render() {
    // if (!this.state.isAuthenticated) {
    //   return <Loading />;
    // }
    return (
      <View>
        <Text>User</Text>
      </View>
    );
  }
}

export default App;
