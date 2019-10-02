import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import firebase from 'react-native-firebase';
import database from 'react-native-firebase';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5fcff;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }
  writeUserData(email, fname, lname) {
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
  }

  render() {
    firebase.analytics().setCurrentScreen('Index');
    return (
      <Container>
        <Text style={styles.welcome}>What The Todo</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>

        <View style={styles.modules}>
          <Text style={styles.modulesHeader}>Installed Firebase Module:</Text>
          {firebase.admob.nativeModuleExists && (
            <Text style={styles.module}>admob()</Text>
          )}
          {firebase.analytics.nativeModuleExists && (
            <Text style={styles.module}>analytics()</Text>
          )}
          {firebase.auth.nativeModuleExists && (
            <Text style={styles.module}>auth()</Text>
          )}
          {firebase.config.nativeModuleExists && (
            <Text style={styles.module}>config()</Text>
          )}
          {firebase.crashlytics.nativeModuleExists && (
            <Text style={styles.module}>crashlytics()</Text>
          )}
          {firebase.database.nativeModuleExists && (
            <Text style={styles.module}>database()</Text>
          )}
          {firebase.firestore.nativeModuleExists && (
            <Text style={styles.module}>firestore()</Text>
          )}
          {firebase.functions.nativeModuleExists && (
            <Text style={styles.module}>functions()</Text>
          )}
          {firebase.iid.nativeModuleExists && (
            <Text style={styles.module}>iid()</Text>
          )}
          {firebase.links.nativeModuleExists && (
            <Text style={styles.module}>links()</Text>
          )}
          {firebase.messaging.nativeModuleExists && (
            <Text style={styles.module}>messaging()</Text>
          )}
          {firebase.notifications.nativeModuleExists && (
            <Text style={styles.module}>notifications()</Text>
          )}
          {firebase.perf.nativeModuleExists && (
            <Text style={styles.module}>perf()</Text>
          )}
          {firebase.storage.nativeModuleExists && (
            <Text style={styles.module}>storage()</Text>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  instructions2: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },
  logo: {
    height: 80,
    marginBottom: 16,
    width: 80,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
