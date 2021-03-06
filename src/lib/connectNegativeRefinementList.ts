import type { SearchParameters, SearchResults } from 'algoliasearch-helper';
import type { NegativeRefinementListConnector } from './types';

/*
 * Creates the connector
 * The connector takes the renderer and the unmounter as parameters and returns a widget factory.
 * This factory is a plain function that takes the connectorParams as parameters and returns a widget.
 * This widget is defined as a plain JS object with methods that will be called during InstantSearch.js lifecycle.
 * Theses methods are of 2 types:
 * - Lifecycle methods (`init`, `render`, `dispose`)
 *   Are called at precise points during the InstantSearch.js global lifecycle.

 *   Can be called internally anytime by InstantSearch.
 */
export const connectNegativeRefinementList: NegativeRefinementListConnector = function connectNegativeRefinementList(
  renderFn,
  unmountFn = () => {}
) {
  return (widgetParams) => {
    const { attribute } = widgetParams;

    return {
      $$type: 'haroen.negativeRefinementList',
      /*
       * Sets up the widget during the InstantSearch initialization.
       * It is called before the first search and is a good place to call the `renderFn` function to set up the initial DOM (a placeholder for example).
       * See `init` documentation https://www.algolia.com/doc/
       */
      init(initOptions) {
        const { instantSearchInstance } = initOptions;

        renderFn(
          {
            ...this.getWidgetRenderState(initOptions),
            instantSearchInstance,
          },
          true
        );
      },

      /*
       * Re-render the widget with the new information from the search, including results.
       * This method is called each time we receive results from Algolia.
       * See `render` documentation https://www.algolia.com/doc/
       */
      render(renderOptions) {
        const { instantSearchInstance } = renderOptions;

        renderFn(
          {
            ...this.getWidgetRenderState(renderOptions),
            instantSearchInstance,
          },
          false
        );
      },

      /*
       * Called when this widget is unmounted.
       * Can be used to remove refinements set by during this widget's initialization and life time.
       * See `dispose` documentation https://www.algolia.com/doc/
       */
      dispose() {
        unmountFn();
      },

      /*
       * Derive a `uiState` for this widget based on the existing `uiState` and the search parameters applied.
       * This method is required for a widget to be taken in account for routing.
       * This method can be called internally anytime by InstantSearch and to avoid any issues they must be defined as pure functions.
       * See `getWidgetUiState` documentation https://www.algolia.com/doc/
       */
      getWidgetUiState(uiState, { searchParameters }) {

        return {
          ...uiState,
          negativeRefinementList: {
            ...uiState.negativeRefinementList,
            [attribute]: searchParameters.getExcludeRefinements(attribute),
          },
        };
      },

      /*
       * It receives the current UiState and applied search parameters, and is expected to return a new search parameters.
       * This method is required for a widget to be taken in account for routing.
       * See `getWidgetSearchParameters` documentation https://www.algolia.com/doc/
       */
      getWidgetSearchParameters(searchParameters, { uiState }) {
        const state = searchParameters.addFacet(attribute);

        const values = uiState.negativeRefinementList?.[attribute];
        if (Array.isArray(values)) {
          return values.reduce<SearchParameters>(
            (acc, curr) => acc.addExcludeRefinement(attribute, curr),
            state
          );
        }
        return state;
      },

      /*
       * Returns IndexRenderState of the current index component tree to build the render state of the whole app.
       * This method is required for a widget to be taken in account for routing.
       * This method can be called internally anytime by InstantSearch and to avoid any issues they must be defined as pure functions.
       * See `getRenderState` documentation https://www.algolia.com/doc/
       */
      getRenderState(renderState, renderOptions) {
        return {
          ...renderState,
          negativeRefinementList: {
            ...renderState.negativeRefinementList,
            [attribute]: this.getWidgetRenderState(renderOptions),
          },
        };
      },

      /*
       * Returns the render state of the current widget.
       * The render state will be passed to the `renderFn` function by the `init` and `render` methods.
       * This method can be called internally anytime by InstantSearch and to avoid any issues they must be defined as pure functions.
       * See `getWidgetRenderState` documentation https://www.algolia.com/doc/
       */
      getWidgetRenderState({ results, helper }) {
        if (!results) {
          return { items: [], refine: () => {}, widgetParams };
        }

        const items = results.getFacetValues(attribute, {
          sortBy: ['name:asc'],
        }) as SearchResults.FacetValue[];

        return {
          items,
          refine: (value) =>
            (helper.isExcluded(attribute, value)
              ? helper.removeFacetExclusion(attribute, value)
              : helper.addFacetExclusion(attribute, value)
            ).search(),
          widgetParams,
        };
      },
    };
  };
};
