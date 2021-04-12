import { connectNegativeRefinementList } from './connectNegativeRefinementList';
import { createNegativeRefinementListRenderer } from './negativeRefinementListRenderer';
import type {
  NegativeRefinementListWidgetCreator,
  NegativeRefinementListConnectorParams,
  NegativeRefinementListWidgetParams,
} from './types';

/*
 * Widget creator
 * Returns a widget instance
 */
export const negativeRefinementList: NegativeRefinementListWidgetCreator = function NegativeRefinementList(
  widgetParams
) {
  const rendererWidgetParams: NegativeRefinementListWidgetParams = {
    container: widgetParams.container,
  };

  const { render, dispose } = createNegativeRefinementListRenderer(
    rendererWidgetParams
  );

  const createWidget = connectNegativeRefinementList(render, dispose);

  const connectorParams: NegativeRefinementListConnectorParams = {
    attribute: widgetParams.attribute,
  };

  return {
    ...createWidget(connectorParams),
    $$widgetType: 'haroen.negativeRefinementList',
  };
};
