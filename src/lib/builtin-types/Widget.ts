import type { SearchParameters } from 'algoliasearch-helper';
import type {
  DisposeOptions,
  IndexRenderState,
  IndexUiState,
  InitOptions,
  RenderOptions,
  WidgetRenderState,
  WidgetUiStateOptions,
} from 'instantsearch.js';
import { Expand, RequiredKeys } from './utils';

export type WidgetOptions = {
  $$type: string;
  $$widgetType?: string;
  renderState?: object;
  indexRenderState?: object;
  indexUiState?: object;
};

export type WidgetParams = {
  widgetParams: NonNullable<unknown>;
};

type UiStateRelatedFunctions<
  TWidgetOptions extends RequiredKeys<WidgetOptions, 'indexUiState'>
> = {
  /**
   * This function is required for a widget to be taken in account for routing.
   * It will derive a uiState for this widget based on the existing uiState and
   * the search parameters applied.
   *
   * @param uiState - Current state.
   * @param widgetStateOptions - Extra information to calculate uiState.
   */
  getWidgetUiState: (
    uiState: Expand<Partial<TWidgetOptions['indexUiState'] & IndexUiState>>,
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
  getWidgetState?: UiStateRelatedFunctions<TWidgetOptions>['getWidgetUiState'];

  /**
   * This function is required for a widget to behave correctly when a URL is
   * loaded via e.g. Routing. It receives the current UiState and applied search
   * parameters, and is expected to return a new search parameters.
   *
   * @param state - Applied search parameters.
   * @param widgetSearchParametersOptions - Extra information to calculate next searchParameters.
   */
  getWidgetSearchParameters: (
    state: SearchParameters,
    widgetSearchParametersOptions: {
      uiState: Expand<Partial<TWidgetOptions['indexUiState'] & IndexUiState>>;
    }
  ) => SearchParameters;
};

type RenderStateRelatedFunctions<
  TWidgetOptions extends RequiredKeys<
    WidgetOptions,
    'renderState' | 'indexRenderState'
  > &
    WidgetParams
> = {
  /**
   * Returns the render state of the current widget to pass to the render function.
   */
  getWidgetRenderState: (
    renderOptions: InitOptions | RenderOptions
  ) => Expand<
    WidgetRenderState<
      TWidgetOptions['renderState'],
      TWidgetOptions['widgetParams']
    >
  >;
  /**
   * Returns IndexRenderState of the current index component tree
   * to build the render state of the whole app.
   */
  getRenderState: (
    renderState: Expand<
      IndexRenderState & Partial<TWidgetOptions['indexRenderState']>
    >,
    renderOptions: InitOptions | RenderOptions
  ) => IndexRenderState & TWidgetOptions['indexRenderState'];
};

type RegularFunctions<TWidgetOptions extends WidgetOptions> = {
  /**
   * Identifier for connectors and widgets.
   */
  $$type: TWidgetOptions['$$type'];

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
};

type WidgetType<
  TWidgetOptions extends RequiredKeys<WidgetOptions, '$$widgetType'>
> = {
  /**
   * Identifier for widgets.
   */
  $$widgetType: TWidgetOptions['$$widgetType'];
};

export type Widget<
  TWidgetOptions extends WidgetOptions & WidgetParams
> = Expand<
  RegularFunctions<TWidgetOptions> &
    (TWidgetOptions extends RequiredKeys<WidgetOptions, '$$widgetType'>
      ? WidgetType<TWidgetOptions>
      : unknown) &
    (TWidgetOptions extends RequiredKeys<WidgetOptions, 'indexUiState'>
      ? UiStateRelatedFunctions<TWidgetOptions>
      : unknown) &
    (TWidgetOptions extends RequiredKeys<
      WidgetOptions,
      'renderState' | 'indexRenderState'
    >
      ? RenderStateRelatedFunctions<TWidgetOptions>
      : unknown)
>;
