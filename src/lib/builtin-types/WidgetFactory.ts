import { Widget, WidgetOptions } from './widget';

export type WidgetFactory<
  TWidgetOptions extends WidgetOptions,
  TConnectorParams,
  TWidgetParams
> = (
  /**
   * The params of the widget.
   */
  widgetParams: TWidgetParams & TConnectorParams
) => Widget<
  TWidgetOptions & {
    widgetParams: TConnectorParams;
  }
>;
