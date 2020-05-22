import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  getLovelace,
} from 'custom-card-helpers';

import { AttributeArrayCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  Attribute-Array-Card \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'attribute-array-card',
  name: 'attribute-array-card',
  description: 'A template custom card for you to create something awesome',
});

// TODO Name your custom element
@customElement('attribute-array-card')
export class AttributeArrayCard extends LitElement {
  //public static async getConfigElement(): Promise<LovelaceCardEditor> {
  //    return document.createElement('boilerplate-card-editor') as LovelaceCardEditor;
  //  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass?: HomeAssistant;
  @property() private _config?: AttributeArrayCardConfig;

  public setConfig(config: AttributeArrayCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    //if (!config || config.show_error) {
    //      throw new Error(localize('common.invalid_configuration'));
    //}

    //if (config.test_gui) {
    //      getLovelace().setEditMode(true);
    //}

    this._config = {
      ...config,
    };
  }

  //protected shouldUpdate(changedProps: PropertyValues): boolean {
  //  return hasConfigOrEntityChanged(this, changedProps, false);
  //}

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    // TODO Check for stateObj or other necessary things and render a warning if missing
    //if (this._config.show_warning) {
    //      return html`
    //<ha-card>
    //          <div class="warning">${localize('common.show_warning')}</div>
    //</ha-card>
    //`;
    //}

    return html`
      <ha-card .header=${this._config.header} } tabindex="0" aria-label=${`Boilerplate: ${this._config.entity}`}>
        Test
      </ha-card>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .warning {
        display: block;
        color: black;
        background-color: #fce588;
        padding: 8px;
      }
    `;
  }
}
