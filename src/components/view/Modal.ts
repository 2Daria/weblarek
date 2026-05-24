import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModalData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalData> {
	protected contentElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.contentElement = ensureElement<HTMLElement>('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

		this.closeButton.addEventListener('click', () => this.close());
		// Клик по затемнению вокруг окна закрывает окно
		this.container.addEventListener('click', () => this.close());
		// Клик по содержимому не должен закрывать окно
		this.contentElement.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open(): void {
		this.container.classList.add('modal_active');
	}

	close(): void {
		this.container.classList.remove('modal_active');
	}
}