import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';

import { negativeRefinementList } from '../src';

const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  routing: true,
});

search.addWidgets([
  searchBox({
    container: '#searchbox',
    placeholder: 'Search for products',
  }),

  negativeRefinementList({
    container: "#exclude",
    attribute: 'brand',
  }),

  hits({
    container: '#products',
    templates: {
      item:
        '{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}',
    },
  }),
]);

search.start();
