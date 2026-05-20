import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderForm {
	payment: TPayment;
	address: string;
}

export class OrderForm extends Form<IOrderForm> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonCard = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._buttonCash = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		this._buttonCard.addEventListener('click', () => {
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'card' as TPayment,
			});
		});
		this._buttonCash.addEventListener('click', () => {
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'cash' as TPayment,
			});
		});
	}

	set payment(value: TPayment) {
		this._buttonCard.classList.toggle('button_alt-active', value === 'card');
		this._buttonCash.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		const input = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		if (input && input.value !== value) input.value = value;
	}
}