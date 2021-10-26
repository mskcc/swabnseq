const properties = {
    'base': {
        root: '/',
        service: '/'
    },
    'dev': {
        root: '/',
        service: 'http://localhost:5000/'
    },
    'qa': {
        root: '/swabnseq/',
        service: '/swabnseq/'

    },
    'prod': {
        root: '/swabnseq/',
        service: '/swabnseq/'

    }
};

const env = process.env.REACT_APP_ENV.toLowerCase();
const config = Object.assign( properties.base, properties[ env ] )
if(env !== 'prod'){
    console.log(`${env} ENVIRONMENT: ${JSON.stringify(config)}`);
}

export default config;
