import {defineConfig} from 'vite';
import config from './config/findthebabies.json' with {type:'json'};
export default defineConfig(({mode})=>({define:{__SITE__:JSON.stringify('findthebabies'),__FIREBASE__:JSON.stringify(mode==='test'?{apiKey:'demo-key',authDomain:'demo-findthebabies.firebaseapp.com',projectId:'demo-findthebabies'}:config)}}));
