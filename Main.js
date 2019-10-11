import React from 'react';
import {StyleSheet, Platform, Button, Text, View} from 'react-native';
import firebase from 'react-native-firebase';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notiPermission: false,
      currentUser: null,
    };
  }
  componentDidMount = () => {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
    this.checkPermission();
    this.messageListener();
  };

  componentWillUnmount = () => {
    this.notificationListener();
    this.notificationOpenedListener();
  };

  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigation.navigate(
          'Login'.catch(error => this.setState({errorMessage: error.message})),
        ),
      );
  };

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
    const {currentUser} = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Button title="Logout" onPress={this.logOut} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
