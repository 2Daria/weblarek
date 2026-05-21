import { IBuyer, TBuyerErrors } from '../../types';

export class Buyer {
	protected payment: IBuyer['payment'] = '';
	protected address: IBuyer['address'] = '';
	protected phone: IBuyer['phone'] = '';
	protected email: IBuyer['email'] = '';

	setData(data: Partial<IBuyer>): void {
		if (data.payment !== undefined) this.payment = data.payment;
		if (data.address !== undefined) this.address = data.address;
		if (data.phone !== undefined) this.phone = data.phone;
		if (data.email !== undefined) this.email = data.email;
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