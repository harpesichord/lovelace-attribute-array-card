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

    const loopArray: Record<string, any>[] = this.hass.states[this._config.entity].attributes[this._config.attribute];

    return html`
      <ha-card .header=${this._config.header} } tabindex="0" aria-label=${`Attribute Array: ${this._config.entity}`}>
        ${loopArray.map(attribute => this.renderAttribute(attribute))}
      </ha-card>
    `;
  }

  renderAttribute(attribute) {
    if (!this._config || !this.hass) {
      return html``;
    }

    return attribute
      ? html`
          <div class="flex">
            <div class="info">
              ${this.renderBadge(attribute)} ${attribute[this._config.name_property || '']}
            </div>
            ${this.renderEntity(this._config.item1_property, attribute[this._config.item1_property || ''])}
            ${this.renderEntity(this._config.item2_property, attribute[this._config.item2_property || ''])}
            ${this.renderEntity(this._config.item3_property, attribute[this._config.item3_property || ''])}
          </div>
          <hr />
        `
      : null;
  }

  renderBadge(attribute): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const classValue: string =
      this._config?.enabled_property &&
      attribute &&
      attribute[this._config?.enabled_property || ''] == this._config?.enabled_value
        ? ''
        : 'hide';

    return html`
      <state-badge
        class="${classValue}"
        .stateObj="${this.hass.states[this._config.entity]}"
        .overrideIcon="${this._config.icon}"
      ></state-badge>
    `;
  }

  renderEntity(name, value): TemplateResult {
    return value && name
      ? html`
          <div class="entity">
            <span>${name}</span>
            <div>${value}</div>
          </div>
        `
      : html``;
  }

  static get styles(): CSSResult {
    return css`
      .warning {
        display: block;
        color: black;
        background-color: #fce588;
        padding: 8px;
      }
      .hide {
        visibility: hidden;
      }
      .flex {
        flex: 1;
        margin-left: 16px;
        margin-right: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 0;
      }
      .info {
        flex: 1 0 60px;
        cursor: pointer;
        font-size: 16px;
      }
      .info,
      .info > * {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .flex ::slotted(*) {
        margin-left: 8px;
        min-width: 0;
      }
      .flex ::slotted([slot='secondary']) {
        margin-left: 0;
      }
      .secondary,
      ha-relative-time {
        display: block;
        color: var(--secondary-text-color);
      }
      state-badge {
        flex: 0 0 40px;
        cursor: pointer;
      }
      .entity {
        margin-right: 16px;
        text-align: center;
        cursor: pointer;
      }
      .entity span {
        font-size: 16px;
        color: var(--secondary-text-color);
      }
      .entity:last-of-type {
        margin-right: 0;
      }
      .state {
        min-width: 45px;
      }
    `;
  }
}
