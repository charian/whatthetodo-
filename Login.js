// Login.js
import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

export default class Login extends React.Component {
  state = {email: '', password: '', errorMessage: null};

  loginWithFacebook = async () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );

    // try {
    //   const result = await LoginManager.logInWithPermissions([
    //     'public_profile',
    //     'email',
    //   ]);
    //   console.log(result);
    //   if (result.isCancelled) {
    //     throw new Error('User cancelled the login process');
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() =>
        this.props.navigation.navigate(
          'Main'.catch(error => this.setState({errorMessage: error.message})),
        ),
      );
    console.log('handleLogin');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage && (
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button title="Login with facebook" onPress={this.loginWithFacebook} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
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
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
});
