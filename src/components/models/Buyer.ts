import { IBuyer, TBuyerErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
	protected payment: IBuyer['payment'] = '';

	protected address: IBuyer['address'] = '';

	protected phone: IBuyer['phone'] = '';

	protected email: IBuyer['email'] = '';

	constructor(protected events: IEvents) {}

	setData(data: Partial<IBuyer>): void {
		if (data.payment !== undefined) this.payment = data.payment;
		if (data.address !== undefined) this.address = data.address;
		if (data.phone !== undefined) this.phone = data.phone;
		if (data.email !== undefined) this.email = data.email;
		this.events.emit('buyer:changed');
	}

	getData(): IBuyer {
		return {
			payment: this.payment,
			address: this.address,
			phone: this.phone,
			email: this.email,
		};
	}

	clear(): void {
		this.payment = '';
		this.address = '';
		this.phone = '';
		this.email = '';
		this.events.emit('buyer:changed');
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.payment) {
			errors.payment = 'Не выбран вид оплаты';
		}
		if (!this.address) {
			errors.address = 'Укажите адрес доставки';
		}
		if (!this.email) {
			errors.email = 'Укажите емэйл';
		}
		if (!this.phone) {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}
}