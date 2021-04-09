import { Renderer } from "instantsearch.js";

export type RendererCreator<TRenderState, TConnectorParams, TWidgetParams> = (
  widgetParams: TWidgetParams
) => {
  render: Renderer<TRenderState, TConnectorParams>;
  dispose: () => void;
};
