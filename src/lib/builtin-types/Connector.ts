import { Renderer, Unmounter } from 'instantsearch.js';
import { Widget, WidgetDescription } from './Widget';

export type Connector<
  TWidgetDescription extends WidgetDescription,
  TConnectorParams
> = <TWidgetParams>(
  /**
   * The render function.
   */
  renderFn: Renderer<
    TWidgetDescription['renderState'],
    TConnectorParams & TWidgetParams
  >,
  /**
   * The called function when unmounting a widget.
   */
  unmountFn?: Unmounter
) => (
  widgetParams: TConnectorParams & TWidgetParams
) => Widget<
  TWidgetDescription & {
    widgetParams: typeof widgetParams;
  }
>;
