# streamdeck-formbuilder

![Build/Test](https://github.com/rweich/streamdeck-formbuilder/workflows/Build%2FTest/badge.svg)
[![codecov](https://codecov.io/gh/rweich/streamdeck-formbuilder/branch/main/graph/badge.svg?token=8JRUM07Acb)](https://codecov.io/gh/rweich/streamdeck-formbuilder)

Helps to build forms for the propertyinspector to ease the settings handling between PI and plugin.

## Installation

```shell
yarn add @rweich/streamdeck-formbuilder
```

### Setup webpack

The sdpi.css from the pisamples are loaded by default. You'll need to add the style-loader and css-loader for it to work with webpack.

```shell
yarn add --dev style-loader css-loader
```

and add both of them to the rules section of your webpack config:

```javascript
{
  test: /\.css$/i,
  use: ['style-loader', 'css-loader'],
}
```

## Usage

TODO :)


## Links

[Propertyinspector styling docs](https://developer.elgato.com/documentation/stream-deck/sdk/property-inspector/)
