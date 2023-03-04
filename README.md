# streamdeck-formbuilder

![Build/Test](https://github.com/rweich/streamdeck-formbuilder/workflows/Build%2FTest/badge.svg)
[![codecov](https://codecov.io/gh/rweich/streamdeck-formbuilder/branch/main/graph/badge.svg?token=8JRUM07Acb)](https://codecov.io/gh/rweich/streamdeck-formbuilder)

Helps to build forms, as described and styled in the [Propertyinspector styling docs](https://developer.elgato.com/documentation/stream-deck/sdk/property-inspector/), for the propertyinspector to ease the settings handling between PI and plugin.

## Installation

```shell
yarn add @rweich/streamdeck-formbuilder
```

### Setup webpack

The sdpi.css from the official [PISamples](https://github.com/elgatosf/streamdeck-pisamples) plugin are loaded by default.

When using webpack, it's necessary to:

1. install the `style-loader` and `css-loader` packages:

    ```shell
    yarn add --dev style-loader css-loader
    ```

1. add both of them to the rules section of your webpack config:

    ```javascript
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }
    ```

## Example Usage

A quick example how to use the formbuilder in the propertyinspector.

:information_source: For a more complete implementation example, check the [formbuilder-showcase](https://github.com/rweich/streamdeck-formbuilder-showcase) streamdeck plugin.

```javascript
import { FormBuilder } from '@rweich/streamdeck-formbuilder';

const initialSettings = {}; // assumes that's whatever you get from the propertyinspector on the didReceiveSettings event
const defaultSettings = { valueOne: 'a default value', valueTwo: 'another default value' };

// create a FormBuilder instance with the values it should use initially
const builder = new FormBuilder({ ...defaultSettings, ...initialSettings });

// add an input field and bind its value to the valueOne-property of the settings
// the values of the elements will (initially) be set to whatever was passed to the FormBuilder above
builder.addElement('valueOne', builder.createInput());
builder.addElement('valueTwo', builder.createInput());

// build the form and append it to the propertyinspectors body element
builder.appendTo(document.body);

// add an eventlistener to send the new settings to the propertyinspector whenever they change
builder.on('change-settings', () => {
  const newSettings = builder.getFormData(); // -> { valueOne: 'the new value', valueTwo: 'another new value' }
  // now the new settings should be sent to the propertyinspector via the setSettings event
  // ...
});
```

## Table of Contents

- [Installation](#installation)
  - [Setup webpack](#setup-webpack)
- [Example Usage](#example-usage)
- [Table of Contents](#table-of-contents)
- [FormBuilder API](#formbuilder-api)
  - [FormBuilder](#formbuilder)
  - [addElement](#addelement)
  - [addHtml](#addhtml)
  - [addHtmlElement](#addhtmlelement)
  - [createDetails](#createdetails)
  - [createDropdown](#createdropdown)
  - [createInput](#createinput)
  - [createRange](#createrange)
- [Details API](#details-api)
  - [addSummary](#addsummary)
  - [addHeadline](#addheadline)
  - [addParagraph](#addparagraph)
  - [addElement](#addelement-1)
- [Dropdown API](#dropdown-api)
  - [addOption](#addoption)
- [Input API](#input-api)
  - [setPlaceholder](#setplaceholder)
- [Range API](#range-api)
  - [enableMinMaxLabels](#enableminmaxlabels)
  - [setTickSteps](#setticksteps)
- [shared Element API](#shared-element-api)
  - [setLabel](#setlabel)
  - [showOn](#showon)
- [Typescript](#typescript)
- [Links](#links)

## FormBuilder API

### FormBuilder

The main entry point is the FormBuilder class.
Pass the initial data for the form as parameter.

```javascript
import { FormBuilder } from '@rweich/streamdeck-formbuilder';
const builder = new FormBuilder({ valueA: 'some initial data', valueB: 'more data' });
```

---

### addElement

Form elements like inputs, dropdowns (or selects) can be added using the addElement method.

`addElement(name: string, element: object): void`

- `name`: the elements name. used as a key of the (resulting) object that holds all the form values
- `element`: one of the elements, created by the create* methods (e.g. [createInput](#createinput))

Example:

```javascript
builder.addElement('valueA', builder.createInput());
```

---

### addHtml

Allows to add elements (like [Details](#createdetails)) that only show information and don't hold any form-related values.

`addHtml(element: { getHtmlElement: () => HTMLElement }): void`

- `element`: object, that exposes a `getHtmlElement` function to return a HTMLElement

Example:

```javascript
builder.addHtml(builder.createDetails().addParagraph('some info-text'));
```

---

### addHtmlElement

Allows to directly add any HTMLElement, only used for display purposes.

`addHtmlElement(element: HTMLElement): void`

- `element`: a plain HTMLElement, as created by `document.createElement(...)`

Example:

```javascript
const element = document.createElement('div');
element.textContent = 'i show things';
builder.addHtmlElement(element);
```

---

### createDetails

> See [Details API](#details-api) to get an overview how to use the Details object.
>
Creates a collapsible detail element to output informational text.

`createDetails(): Details`

Example:

```javascript
builder.addHtml(builder.createDetails().addParagraph('example paragraph'));
```

---

### createDropdown

> See [Dropdown API](#dropdown-api) to get an overview how to use the return value.

Creates a drowpdown / select element.

`createDropdown(): Details`

Example:

```javascript
builder.addElement('count', builder.createDropdown().addOption('One', 'one').addOption('Two', 'two'));
```

---

### createInput

> See [Input API](#input-api) to get an overview how to use the return value.

Creates a text input element.

Example:

```javascript
builder.addElement('username', builder.createInput());
```

---

### createRange

> See [Range API](#range-api) to get an overview how to use the return value.

Creates a range-input (or slider) element.

`createRange(min: number, max: number, step: number = 1): Range`

- `min`: The lowest value in the range of permitted values
- `max`: The greatest value in the range of permitted values
- `step`: The step attribute is a number that specifies the granularity that the value must adhere to.
Will make the slider snap to the steps.

Example:

```javascript
builder.addElement('brightness', builder.createRange(1, 10));
```

## Details API

The `Details` object, returned by `createDetails`, can be customized using the following methods.

Example:

```javascript
builder.createDetails()
  .addSummary('More Info')
  .addHeadline('a headline')
  .addParagraph('some text')
  .addHeadline('another headline')
  .addParagraph('more text');
```

### addSummary

Adds a summary to the details, which is displayed as the title (the clickable text that still shows when the details are collapsed).

`addSummary(text: string): Details`

---

### addHeadline

Adds a headline to the details.

`addHeadline(text: string): Details`

---

### addParagraph

Adds a paragraph with text to the details.

`addParagraph(text: string): Details`

---

### addElement

Allows to add any html element to the details.

`addElement(element: HTMLElement): Details`

## Dropdown API

The `Dropdown` object, returned by `createDropdown`, can be customized using the following methods (including the ones from the [shared API](#shared-element-api).

Example:

```javascript
builder.createDropdown()
  .setLabel('choose a color')
  .addOption('the color red', 'red')
  .addOption('the color green', 'green')
  .addOption('the color blue', 'blue');
```

### addOption

Adds one selectable option to the dropdown.

`addOption(label: string, value: string): Dropdown`

- `label`: The text to display
- `value`: The value, that will be used internally when the option was selected

## Input API

The `Input` object, returned by `createInput`, can be customized using the following methods (including the ones from the [shared API](#shared-element-api).

Example:

```javascript
builder.createInput()
  .setLabel('a label')
  .setPlaceholder('placeholder');
```

### setPlaceholder

Sets the placeholder that will be displayed in the field when its empty

`setPlaceholder(placeholder: string): Input`

## Range API

The `Range` object, returned by `createRange`, can be customized using the following methods (including the ones from the [shared API](#shared-element-api).

Example:

```javascript
builder.createRange(0, 100, 20)
  .setLabel('choose a size')
  .enableMinMaxLabels()
  .enableTicks();
```

### enableMinMaxLabels

Show labels displaying the min-max values in front and behind the slider.

`enableMinMaxLabels(): Range`

---

### enableTicks

Shows tick marks below the slider.

`enableTicks(): Range`

## shared Element API

Elements, added by `addElement` share the following functions.

### setLabel

Sets the label that will be displayed alongside the form element.

`setLabel(label: string): Input`

---

### showOn

Allows to show / hide the element based on another elements value.
The callback gets called on every change to any of the form elements.
Based on the return value of the callback the element will be shown (when true) or hidden (when false).

`showOn(callback: () => boolean): Input`

- `callback`: a function that returns `true` to show or `false` to hide the element

Example:

```javascript
builder.createInput().showOn(() => builder.getFormData().color === 'red');
```

## Typescript

To get typings (mosty for allowed key-names) for addElement() and the return of getFormData(), add the type like this:

```typescript
import { FormBuilder } from '@rweich/streamdeck-formbuilder';

type Settings = {
  valueA: string;
  valueB: 'yes' | 'no';
}

const builder = new FormBuilder<Settings>({ valueA: 'some initial data', valueB: 'yes' });
```

## Links

[Propertyinspector styling docs](https://developer.elgato.com/documentation/stream-deck/sdk/property-inspector/)
