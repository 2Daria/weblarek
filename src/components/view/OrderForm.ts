import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrderFormData, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IOrderFormData> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			container
		);

		this.cardButton.addEventListener('click', () => {
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'card',
			});
		});
		this.cashButton.addEventListener('click', () => {
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'cash',
			});
		});
	}

	set payment(value: TPayment) {
		this.cardButton.classList.toggle('button_alt-active', value === 'card');
		this.cashButton.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		if (this.addressInput.value !== value) {
			this.addressInput.value = value;
		}
	}
}