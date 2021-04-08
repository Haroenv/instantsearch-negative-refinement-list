import { SearchResults } from 'algoliasearch-helper';

import type {
  Connector,
  WidgetFactory,
  RendererCreator,
} from './builtin-types';

/*
 * Parameters send only to the widget creator function
 * These parameters will be used by the widget creator to create the widget renderer and factory
 */
export type NegativeRefinementListWidgetParams = {
  container: string | Element;
};

/*
 * Parameters send to the widget creator function
 * These parameters will be used by the widget creator to manage the widget logic
 */
export type NegativeRefinementListConnectorParams = {
  attribute: string;
};

export type NegativeRefinementListRenderState = {
  items: SearchResults.FacetValue[];
  refine(value: string): void;
};

export type NegativeRefinementListRendererOptions = NegativeRefinementListRenderState;

type NegativeRefinementListWidgetOptions = {
  renderState: NegativeRefinementListRenderState;
  indexRenderState: {
    negativeRefinementList: {
      [attribute: string]: NegativeRefinementListRenderState;
    };
  };
  indexUiState: {
    negativeRefinementList: {
      [attribute: string]: string[];
    };
  };
};

/*
 * Connector type, constructed from the Renderer and Connector parameters
 */
export type NegativeRefinementListConnector = Connector<
  NegativeRefinementListWidgetOptions,
  NegativeRefinementListConnectorParams,
  'haroen.negativeRefinementList'
>;

/*
 * Renderer type, constructed from the Renderer and Connector parameters
 */
export type NegativeRefinementListRendererCreator = RendererCreator<
  NegativeRefinementListRendererOptions,
  NegativeRefinementListConnectorParams,
  NegativeRefinementListWidgetParams
>;

/*
 * Widget type, constructed from the Renderer, Connector and Widget parameters
 */
export type NegativeRefinementListWidgetCreator = WidgetFactory<
  NegativeRefinementListWidgetOptions,
  NegativeRefinementListConnectorParams,
  NegativeRefinementListWidgetParams,
  'haroen.negativeRefinementList',
  'haroen.negativeRefinementList'
>;
