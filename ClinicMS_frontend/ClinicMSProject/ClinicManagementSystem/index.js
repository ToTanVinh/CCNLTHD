import { registerRootComponent } from "expo";

import App from "./App";
import Login from "./components/Login/Login";
import NewAccount from "./components/NewAccount/NewAccount";
// import Register from "./components/RegisterMain/RegisterMain";
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
