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

export type WidgetDescription = {
  $$type: string;
  $$widgetType?: string;
  renderState?: object;
  indexRenderState?: object;
  indexUiState?: object;
};

export type WidgetParams = {
  widgetParams: NonNullable<unknown>;
};

type RequiredWidgetLifeCycle<TWidgetDescription extends WidgetDescription> = {
  /**
   * Identifier for connectors and widgets.
   */
  $$type: TWidgetDescription['$$type'];

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
  TWidgetDescription extends WidgetDescription
> = TWidgetDescription extends RequiredKeys<WidgetDescription, '$$widgetType'>
  ? {
      /**
       * Identifier for widgets.
       */
      $$widgetType: TWidgetDescription['$$widgetType'];
    }
  : unknown;

type UiStateLifeCycle<
  TWidgetDescription extends WidgetDescription
> = TWidgetDescription extends RequiredKeys<WidgetDescription, 'indexUiState'>
  ? {
      /**
       * This function is required for a widget to be taken in account for routing.
       * It will derive a uiState for this widget based on the existing uiState and
       * the search parameters applied.
       *
       * @param uiState - Current state.
       * @param widgetStateOptions - Extra information to calculate uiState.
       */
      getWidgetUiState: (
        uiState: Expand<
          Partial<TWidgetDescription['indexUiState'] & IndexUiState>
        >,
        widgetUiStateOptions: WidgetUiStateOptions
      ) => IndexUiState & TWidgetDescription['indexUiState'];

      /**
       * This function is required for a widget to be taken in account for routing.
       * It will derive a uiState for this widget based on the existing uiState and
       * the search parameters applied.
       *
       * @deprecated Use `getWidgetUiState` instead.
       * @param uiState - Current state.
       * @param widgetStateOptions - Extra information to calculate uiState.
       */
      getWidgetState?: UiStateLifeCycle<TWidgetDescription>['getWidgetUiState'];

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
          uiState: Expand<
            Partial<TWidgetDescription['indexUiState'] & IndexUiState>
          >;
        }
      ) => SearchParameters;
    }
  : unknown;

type RenderStateLifeCycle<
  TWidgetDescription extends WidgetDescription & WidgetParams
> = TWidgetDescription extends RequiredKeys<
  WidgetDescription,
  'renderState' | 'indexRenderState'
> &
  WidgetParams
  ? {
      /**
       * Returns the render state of the current widget to pass to the render function.
       */
      getWidgetRenderState: (
        renderOptions: InitOptions | RenderOptions
      ) => Expand<
        WidgetRenderState<
          TWidgetDescription['renderState'],
          TWidgetDescription['widgetParams']
        >
      >;
      /**
       * Returns IndexRenderState of the current index component tree
       * to build the render state of the whole app.
       */
      getRenderState: (
        renderState: Expand<
          IndexRenderState & Partial<TWidgetDescription['indexRenderState']>
        >,
        renderOptions: InitOptions | RenderOptions
      ) => IndexRenderState & TWidgetDescription['indexRenderState'];
    }
  : unknown;

export type Widget<
  TWidgetDescription extends WidgetDescription & WidgetParams
> = Expand<
  RequiredWidgetLifeCycle<TWidgetDescription> &
    WidgetType<TWidgetDescription> &
    UiStateLifeCycle<TWidgetDescription> &
    RenderStateLifeCycle<TWidgetDescription>
>;
