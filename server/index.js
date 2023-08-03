require('ignore-styles')

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env'],
    "plugins": [
        "@babel/transform-runtime",
        "@babel/plugin-proposal-class-properties"
    ]
})

require('./src/app')