import { Widget, WidgetDescription } from './widget';

export type WidgetFactory<
  TWidgetDescription extends WidgetDescription,
  TConnectorParams,
  TWidgetParams
> = (
  /**
   * The params of the widget.
   */
  widgetParams: TWidgetParams & TConnectorParams
) => Widget<
  TWidgetDescription & {
    widgetParams: TConnectorParams;
  }
>;
