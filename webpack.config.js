const webpackConfig = require('webpack-typescript-boilerplate')

module.exports = webpackConfig({
    entryPoints: {
        main: "src/main.ts"
    },
    port: 8080,
    sourceFolder: "src",
    assetsFolder: "assets",
    HTMLTemplate: "assets/index.html",
    templateParameters: {
        "title": ""
    },
    https: false,
})