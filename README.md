# Negative refinement list for InstantSearch.js

Allows you to exclude a refinement from the result set.

## Install

Using npm:

```bash
npm install instantsearch-negative-refinement-list
```

or using yarn:

```bash
yarn add instantsearch-negative-refinement-list
```

## Widget

### Usage

```js
import { negativeRefinementList } from 'instantsearch-negative-refinement-list';

const search = instantsearch({
  indexName: 'indexName',
  searchClient: algoliasearch('appId', 'apiKey'),
});

search.addWidgets([
  negativeRefinementList({
    container: '#exclude', // Name of the widget container,
    attribute: 'brand', // Name of the attribute,
    // Optional parameters
    // ...
  }),
]);

search.start();
```

### Options

#### container

type: `string` | `HTMLElement`

required: true

The element to insert the widget into.

This can be either a valid CSS Selector:

```js
negativeRefinementList({
  container: '#exclude',
  // ...
});
```

or an `HTMLElement`:

```js
negativeRefinementList({
  container: document.querySelector('#negative-refinement-list'),
  // ...
});
```

#### attribute

type: `string[]`

required: true

The name of the attribute to exclude from the results.

```js
negativeRefinementList({
  attribute: 'price',
  // ...
});
```

## Connector

### Usage

```js
import { connectNegativeRefinementList } from 'instantsearch-negative-refinement-list';

// 1. Create a render function
const renderNegativeRefinementList = (renderOptions, isFirstRender) => {
  // Rendering logic
};

// 2. Create the custom widget
const customNegativeRefinementList = connectNegativeRefinementList(
  renderNegativeRefinementList
);

// 3. Instantiate
search.addWidgets([
  customNegativeRefinementList({
    // instance params
  }),
]);
```

### Options

#### items

type: object[]

The list of available items, with each item:

- `label: string`: the label of the item.
- `value: string`: the value of the item.
- `count: number`: the number results matching this value.
- `isExcluded: boolean`: whether or not the item is selected.

```js
const renderList = (items) => `
  <ul>
    ${items
      .map(
        (item) => `
        <li>
          ${item.isExcluded ? 'x' : ''} ${item.label} (${item.count})</button>
        </li>
      `
      )
      .join('')}
  </ul>
`;

const renderNegativeRefinementList = (renderOptions, isFirstRender) => {
  const { items } = renderOptions;
  const children = renderList(items);
  document.querySelector('#negative-refinement-list').innerHTML = children;
};
```

#### widgetParams

type: object

All original widget options forwarded to the render function.

```js
const renderNegativeRefinementList = (renderOptions, isFirstRender) => {
  const { widgetParams } = renderOptions;
  widgetParams.container.innerHTML = '...';
};

// ...

search.addWidgets([
  customNegativeRefinementList({
    container: document.querySelector('#negative-refinement-list'),
    // ...
  }),
]);
```
