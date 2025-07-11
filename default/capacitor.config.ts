import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'default-velzon-thunk',
  webDir: 'build',
  plugins: {
    StatusBar: {
      style: 'dark',
      overlaysWebView: false
    }
  }
};

export default config;
