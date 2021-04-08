import type { SearchParameters } from 'algoliasearch-helper';
import type {
  DisposeOptions,
  IndexRenderState,
  IndexUiState,
  InitOptions,
  Renderer,
  RenderOptions,
  Unmounter,
  WidgetRenderState,
  WidgetUiStateOptions,
} from 'instantsearch.js';

// TODO: these will move to InstantSearch.js directly

type RendererOptions = {
  renderState: unknown;
  indexRenderState: unknown;
  indexUiState: unknown;
};

export type Widget<
  TWidgetOptions extends RendererOptions,
  TType extends string,
  TWidgetType extends string | never = never
> = {
  /**
   * Identifier for connectors and widgets.
   */
  $$type: TType;

  /**
   * Called once before the first search.
   */
  init?: (options: InitOptions) => void;
  /**
   * Called after each search response has been received.
   */
  render?: (options: RenderOptions) => void;
  /**
   * Called when this widget is unmounted. Used to remove refinements set by
   * during this widget's initialization and life time.
   */
  dispose?: (options: DisposeOptions) => SearchParameters | void;
  /**
   * This function is required for a widget to be taken in account for routing.
   * It will derive a uiState for this widget based on the existing uiState and
   * the search parameters applied.
   *
   * @param uiState - Current state.
   * @param widgetStateOptions - Extra information to calculate uiState.
   */
  getWidgetUiState?: (
    uiState: IndexUiState & TWidgetOptions['indexUiState'],
    widgetUiStateOptions: WidgetUiStateOptions
  ) => IndexUiState & TWidgetOptions['indexUiState'];

  /**
   * This function is required for a widget to be taken in account for routing.
   * It will derive a uiState for this widget based on the existing uiState and
   * the search parameters applied.
   *
   * @deprecated Use `getWidgetUiState` instead.
   * @param uiState - Current state.
   * @param widgetStateOptions - Extra information to calculate uiState.
   */
  getWidgetState?: Widget<
    TWidgetOptions,
    TType,
    TWidgetType
  >['getWidgetUiState'];

  /**
   * This function is required for a widget to behave correctly when a URL is
   * loaded via e.g. Routing. It receives the current UiState and applied search
   * parameters, and is expected to return a new search parameters.
   *
   * @param state - Applied search parameters.
   * @param widgetSearchParametersOptions - Extra information to calculate next searchParameters.
   */
  getWidgetSearchParameters?: (
    state: SearchParameters,
    widgetSearchParametersOptions: {
      uiState: IndexUiState & TWidgetOptions['indexUiState'];
    }
  ) => SearchParameters;
} & (TWidgetOptions['renderState'] extends Record<string, unknown>
  ? {
      /**
       * Returns the render state of the current widget to pass to the render function.
       */
      getWidgetRenderState: (
        renderOptions: InitOptions | RenderOptions
      ) => TWidgetOptions['renderState'];
      /**
       * Returns IndexRenderState of the current index component tree
       * to build the render state of the whole app.
       */
      getRenderState: (
        renderState: IndexRenderState & TWidgetOptions['indexRenderState'],
        renderOptions: InitOptions | RenderOptions
      ) => IndexRenderState & TWidgetOptions['indexRenderState'];
    }
  : unknown);
// &
// (TWidgetType extends string
//   ? {
//       /**
//        * Identifier for widgets.
//        */
//       $$widgetType: TWidgetType;
//     }
//   : unknown);

export type WidgetFactory<
  TRendererOptions extends RendererOptions,
  TConnectorParams,
  TWidgetParams,
  TType extends string,
  TWidgetType extends string | never = never
> = (
  /**
   * The params of the widget.
   */
  widgetParams: TWidgetParams & TConnectorParams
) => Widget<
  TRendererOptions & {
    renderState: WidgetRenderState<
      TRendererOptions['renderState'],
      TConnectorParams
    >;
  },
  TType,
  TWidgetType
>;

export type Connector<
  TRendererOptions extends RendererOptions,
  TConnectorParams,
  TType extends string
> = <TWidgetParams>(
  /**
   * The render function.
   */
  renderFn: Renderer<
    TRendererOptions['renderState'],
    TConnectorParams & TWidgetParams
  >,
  /**
   * The called function when unmounting a widget.
   */
  unmountFn?: Unmounter
) => (
  widgetParams: TConnectorParams & TWidgetParams
) => Widget<
  TRendererOptions & {
    renderState: WidgetRenderState<
      TRendererOptions['renderState'],
      TConnectorParams & TWidgetParams
    >;
  },
  TType
>;

export type RendererCreator<TRenderOptions, TConnectorParams, TWidgetParams> = (
  widgetParams: TWidgetParams
) => {
  render: Renderer<TRenderOptions, TConnectorParams>;
  dispose: () => void;
};
