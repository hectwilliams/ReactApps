import { createDefaultPreset } from "ts-jest";
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {

  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },
  
  moduleDirectories: ['node_modules', '<rootDir>/client/src/static/css'],
  
   moduleNameMapper: {

     '\\.module\\.(css|less|scss|sass)$': 'identity-obj-proxy',
     
     '^.+\\.(css|sass|scss)$': '<rootDir>/client/test/__mocks__/styleMock.js',

     
    //  '^@/css/module.css': '<rootDir>/client/src/static/css/Main.module.css',
    // '\\.(css|less|scss|sass)$': '<rootDir>/client/test/__mocks__/styleMock.js',

    // map css files to new reference for jest 
    // '^@/css/(.*)$': '<rootDir>/client/src/static/css/$1',

    // '\\.css\\.(css|sass|scss)$': 'identity-obj-proxy',

    
  },
  

  // modulePaths: [
  //   '<rootDir>/client/src/'
  // ],import styles from '@/styles/button.module.css';



};