import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IPageData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<IPageData> {
	protected counterElement: HTMLElement;
	protected catalogElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
		this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.counterElement.textContent = String(value);
	}

	set catalog(items: HTMLElement[]) {
		this.catalogElement.replaceChildren(...items);
	}
}