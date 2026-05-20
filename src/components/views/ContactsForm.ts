import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IContactsForm {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._emailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;

		this._phoneInput.type = 'tel';
		this._phoneInput.setAttribute('inputmode', 'numeric');
		this._phoneInput.setAttribute('maxlength', '18'); // +7 (XXX) XXX-XX-XX = 18 символов

		this._phoneInput.addEventListener(
			'input',
			(e: Event) => {
				const input = e.target as HTMLInputElement;
				input.value = this.formatPhone(input.value);
			},
			true // capture: true — выполняемся раньше базового обработчика
		);

		this._phoneInput.addEventListener('focus', () => {
			if (!this._phoneInput.value) {
				this._phoneInput.value = '+7 (';
			}
		});
		this._phoneInput.addEventListener('blur', () => {
			if (this._phoneInput.value === '+7 (' || this._phoneInput.value === '+7') {
				this._phoneInput.value = '';
				this._phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});
	}

	protected formatPhone(value: string): string {
		let digits = value.replace(/\D/g, '');

		if (digits.startsWith('8') || digits.startsWith('7')) {
			digits = digits.slice(1);
		}

		digits = digits.slice(0, 10);

		const parts: string[] = ['+7'];
		if (digits.length > 0) parts.push(' (' + digits.slice(0, 3));
		if (digits.length >= 3) parts.push(') ');
		if (digits.length >= 3) parts.push(digits.slice(3, 6));
		if (digits.length >= 6) parts.push('-');
		if (digits.length >= 6) parts.push(digits.slice(6, 8));
		if (digits.length >= 8) parts.push('-');
		if (digits.length >= 8) parts.push(digits.slice(8, 10));

		return parts.join('');
	}

	set email(value: string) {
		if (this._emailInput && this._emailInput.value !== value) {
			this._emailInput.value = value;
		}
	}

	set phone(value: string) {
		if (this._phoneInput && this._phoneInput.value !== value) {
			this._phoneInput.value = value;
		}
	}
}