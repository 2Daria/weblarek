import { IBuyer, TBuyerErrors } from '../../types';

export class Buyer {
  protected payment: IBuyer['payment'] = '';
	protected address: IBuyer['address'] = '';
	protected email: IBuyer['email'] = '';
	protected phone: IBuyer['phone'] = '';

	setData(data: Partial<IBuyer>): void {
		if (data.payment !== undefined) this.payment = data.payment;
		if (data.address !== undefined) this.address = data.address;
		if (data.email !== undefined) this.email = data.email;
		if (data.phone !== undefined) this.phone = data.phone;
	}

	getData(): IBuyer {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

  clear(): void {
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.address.trim()) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.email.trim()) {
			errors.email = 'Необходимо указать email';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
			errors.email = 'Некорректный email';
		}

		if (!this.phone.trim()) {
			errors.phone = 'Необходимо указать телефон';
		} else {
			const digits = this.phone.replace(/\D/g, '');
			if (digits.length !== 11) {
				errors.phone = 'Введите телефон полностью';
			}
		}

		return errors;
	}
}