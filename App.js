import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase';
import BlurOverlay, {
  closeOverlay,
  openOverlay,
} from 'react-native-blur-overlay';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    //TODO: You: Do firebase things
    const {user} = await firebase.auth().signInAnonymously();
    console.warn('User -> ', user.toJSON());
    await firebase.analytics().logEvent('foo', {bar: '123'});
  }

  renderBlurChilds() {
    return (
      <View style={styles.image}>
        <Text style={styles.instructions2}>{instructions}</Text>

        <Text style={styles.instructions2}>{instructions}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            openOverlay();
          }}
          style={{
            width: '90%',
            height: 36,
            backgroundColor: '#03A9F4',
            borderRadius: 4,
            margin: 16,
          }}
        />

        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>
        ) : (
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Cmd+M or shake for dev menu
          </Text>
        )}
        <View style={styles.modules}>
          <Text style={styles.modulesHeader}>
            The following Firebase modules are pre-installed:
          </Text>
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
        <BlurOverlay
          radius={14}
          downsampling={2}
          brightness={-200}
          onPress={() => {
            closeOverlay();
          }}
          customStyles={{alignItems: 'center', justifyContent: 'center'}}
          blurStyle="light"
          children={this.renderBlurChilds()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
