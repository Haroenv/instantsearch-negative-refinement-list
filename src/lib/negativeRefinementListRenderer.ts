import type { NegativeRefinementListRendererCreator } from './types';

/*
 * Creates the render and dispose functions
 * This function is called once by the connector when the widget is created and is returning
 *  - the `render` function used to render the widget
 *  - the `dispose` function used to clean the changes made by the widget
 * It can also be used to keep references of objects that must be reused between renders
 */
export const createNegativeRefinementListRenderer: NegativeRefinementListRendererCreator = ({
  container,
}) => {
  const containerNode: Element =
    typeof container === 'string'
      ? document.querySelector(container)!
      : container;

  const list = document.createElement('ol');

  return {
    /*
     * The render function passed to the connector
     * This function is called when we need to render the widget.
     * The render appends when:
     * - the widget is added to InstantSearch
     * - we receive new results from Algolia
     */
    render(renderOptions, isFirstRender) {
      /*
       * `renderOptions` contains all options passed by the connector to the renderer, it contains everything needed for the rendering of the component
       * See `renderOptions` documentation https://www.algolia.com/doc/
       */
      const { items, refine } = renderOptions;

      console.log(renderOptions)

      if (isFirstRender) {
        /*
         * When the widget is rendered for the first time `isFirstRender` is set to `true`
         * This is when we will create everything that must be reused between renders (containers, event listeners, etc.)
         */

        containerNode.appendChild(list);
      }

      list.innerText = '';

      /*
       * Update the widget using the data from `renderOptions`
       */
      items.forEach((item) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = "checkbox"
        input.checked = item.isExcluded;

        input.addEventListener('change', (e) => {
  refine(item.name)
        })

        const text = document.createTextNode(item.name);

        li.appendChild(label)
        label.appendChild(input)
        label.appendChild(text)
        list.appendChild(li);
      });
    },
    /*
     * The dispose function passed to the connector
     * This function is called when the widget is removed from InstantSearch.
     * It must be used to remove any changes made by the render function (DOM changes, global event listeners, etc.)
     */
    dispose() {
      containerNode.removeChild(list);
    },
  };
};
