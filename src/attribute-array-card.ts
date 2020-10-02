import { LitElement, html, customElement, property, CSSResult, TemplateResult, css } from 'lit-element';
import { HomeAssistant } from 'custom-card-helpers';
import { AttributeArrayCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import { operators } from './helpers';

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

@customElement('attribute-array-card')
export class AttributeArrayCard extends LitElement {
  public static getStubConfig(): object {
    return {};
  }

  @property() public hass?: HomeAssistant;
  @property() private _config?: AttributeArrayCardConfig;

  public setConfig(config: AttributeArrayCardConfig): void {
    if (!config) throw new Error(localize('common.invalid_configuration'));
    else if (!config.attribute || !config.entity) throw new Error(localize('common.missing_required'));

    this._config = {
      ...config,
    };
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    const loopArray: Record<string, any>[] =
      this.hass.states[this._config.entity].attributes[this._config.attribute] ?? [];

    return html`
      <ha-card .header=${this._config.header} } tabindex="0" aria-label=${`Attribute Array: ${this._config.entity}`}>
        ${loopArray.map(item => this.renderArrayItem(item))}
      </ha-card>
    `;
  }

  renderArrayItem(attributeItem): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    return attributeItem
      ? html`
          <div class="flex">
            <div class="info">
              ${this.renderBadge(attributeItem)} ${attributeItem[this._config.name_property || '']}
            </div>
            ${this.renderProperty(this._config.item1_property || '', attributeItem[this._config.item1_property || ''])}
            ${this.renderProperty(this._config.item2_property || '', attributeItem[this._config.item2_property || ''])}
            ${this.renderProperty(this._config.item3_property || '', attributeItem[this._config.item3_property || ''])}
          </div>
          <hr />
        `
      : html``;
  }

  renderBadge(attributeItem): TemplateResult {
    if (!this._config || !this.hass || !attributeItem) {
      return html``;
    }

    let classValue = '';
    let iconValue = '';
    let opeatorFunc = operators[this._config?.enabled_operator || '=='] || operators['=='];

    operators[this._config?.enabled_operator || '=='](3,3)

    if (
      this._config?.enabled_icon &&
      this._config?.enabled_value != undefined &&
      this._config?.enabled_property &&
      opeatorFunc(attributeItem[this._config?.enabled_property], this._config?.enabled_value)
    )
      iconValue = this._config?.enabled_icon;
    else if (this._config?.icon) iconValue = this._config?.icon;
    else classValue = 'hide';

    return html`
      <state-badge
        class="${classValue}"
        .stateObj="${this.hass.states[this._config.entity]}"
        .overrideIcon="${iconValue}"
      ></state-badge>
    `;
  }

  renderProperty(name: string, value: string): TemplateResult {
    return value && name
      ? html`
          <div class="property">
            <span>${name}</span>
            <div>${value}</div>
          </div>
        `
      : html``;
  }

  static get styles(): CSSResult {
    return css`
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
      .property {
        margin-right: 16px;
        text-align: center;
        cursor: pointer;
      }
      .property span {
        font-size: 16px;
        color: var(--secondary-text-color);
      }
      .property:last-of-type {
        margin-right: 0;
      }
    `;
  }
}
