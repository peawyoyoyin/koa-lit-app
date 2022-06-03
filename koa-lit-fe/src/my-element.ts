import { html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  @property({ attribute: false })
  name = null

  @property({ attribute: false })
  balance = null

  @property({ attribute: false })
  latestTransactionId = null

  @query('#account-id')
  accountIdInput!: HTMLInputElement;

  @query('#amount')
  amountInput!: HTMLInputElement;

  @query('#target-account')
  targetAccountInput!: HTMLInputElement;

  async onAccountFetch() {
    const res = await fetch(`/api/users/${this.accountIdInput.value}`)
    const resJson = await res.json()
    
    this.name = resJson.name
    this.balance = resJson.balance
  }

  async onTransfer() {
    const res = await fetch(`/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },  
      body: JSON.stringify({
        from: parseInt(this.accountIdInput.value),
        to: parseInt(this.targetAccountInput.value),
        amount: parseFloat(this.amountInput.value)
      })
    })
    const resJson = await res.json();
    this.latestTransactionId = resJson.transaction_id;

    await this.onAccountFetch();
  }

  render() {
    return html`
      <h1>Transfer</h1>
      <div class="flex">
        <div class="flex-1">
          <h2>Profile</h2>
          <label>Input Account ID</label>
          <input id="account-id">
          <button @click=${this.onAccountFetch}>Fetch Account Info</button>
          <p>${this.name}</p>
          <p>${this.balance}</p>
        </div>
        <div class="flex-1">
          <h2>Transfer</h2>
          <div>
            <div>
              <label>Amount</label>
              <input id="amount" type="number" step="0.01" min="0.00">
            </div>
            <div>
              <label>Target Account</label>
              <input id="target-account">
            </div>
          </div>
          <button @click=${this.onTransfer}>
            Transfer
          </button>
          ${this.latestTransactionId ? html`<p>transaction ${this.latestTransactionId} created!</p>` : ''}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
