import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IContactsFormData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<IContactsFormData> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name=email]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			container
		);
	}

	set email(value: string) {
		if (this.emailInput.value !== value) {
			this.emailInput.value = value;
		}
	}

	set phone(value: string) {
		if (this.phoneInput.value !== value) {
			this.phoneInput.value = value;
		}
	}
}