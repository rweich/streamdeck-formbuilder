# streamdeck-formbuilder

Helps to build forms for the propertyinspector to ease the settings handling between PI and plugin.

## Installation

```shell
yarn add @rweich/streamdeck-formbuilder
```

### Setup webpack

The sdpi.css from the pisamples are loaded by default. You'll need to add the style-loader and css-loader for it to work with webpack.

```shell
yarn add style-loader css-loader
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
