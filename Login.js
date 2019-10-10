// Login.js
import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';

export default class Login extends React.Component {
  state = {email: '', password: '', errorMessage: null};

  loginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        // handle this however suites the flow of your app
        //throw new Error('User cancelled request');
        // alert('Login was cancelled');
        console.log('user has cancelled' + result.isCancelled);
      } else {
      }

      // console.log(
      //   `Login success with permissions: ${result.grantedPermissions.toString()}`,
      // );

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          'Something went wrong obtaining the users access token',
        );
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      console.error(e);
    }

    // LoginManager.logInWithPermissions(['public_profile']).then(
    //   function(result) {
    //     if (result.isCancelled) {
    //       console.log('Login cancelled');
    //     } else {
    //       console.log(
    //         'Login success with permissions: ' +
    //           result.grantedPermissions.toString(),
    //       );
    //     }
    //   },
    //   function(error) {
    //     console.log('Login fail with error: ' + error);
    //   },
    // );

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
        {/* <LoginButton
          //publishPermissions={['email']}
          onLoginFinished={(error, result) => {
            if (error) {
              alert('Login failed with error: ' + error.message);
            } else if (result.isCancelled) {
              alert('Login was cancelled');
            } else {
              alert(
                'Login was successful with permissions: ' +
                  result.grantedPermissions,
              );
            }
          }}
          onLogoutFinished={() => alert('User logged out')}
        /> */}
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
