import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';
import { ensureElement, createElement } from '../../utils/utils';

export class BasketView extends Component<IBasketView> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.buttonElement.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.listElement.replaceChildren(...items);
		} else {
			this.listElement.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}

	set isEmpty(value: boolean) {
		this.buttonElement.disabled = value;
	}
}