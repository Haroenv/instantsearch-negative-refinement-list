import { Renderer, Unmounter } from 'instantsearch.js';
import { Widget, WidgetOptions } from './Widget';

export type Connector<
  TWidgetOptions extends WidgetOptions,
  TConnectorParams
> = <TWidgetParams>(
  /**
   * The render function.
   */
  renderFn: Renderer<
    TWidgetOptions['renderState'],
    TConnectorParams & TWidgetParams
  >,
  /**
   * The called function when unmounting a widget.
   */
  unmountFn?: Unmounter
) => (
  widgetParams: TConnectorParams & TWidgetParams
) => Widget<
  TWidgetOptions & {
    widgetParams: typeof widgetParams;
  }
>;
