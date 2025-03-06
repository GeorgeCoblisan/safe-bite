import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safebite.app',
  appName: 'SafeBite',
  webDir: 'www',
  ios: {
    contentInset: 'always',
  },
};

export default config;
