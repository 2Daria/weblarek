import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Form<T> extends Component<IFormState & T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

		// Любое изменение поля ввода уведомляет презентер
		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.container.name}.${field}:change`, {
				field,
				value,
			});
		});

		// Отправка формы
		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}
}