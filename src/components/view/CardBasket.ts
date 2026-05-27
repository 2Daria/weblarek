import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ICardBasket } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card<ICardBasket> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;
	protected cardId = '';

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

		this.deleteButton.addEventListener('click', () => {
			this.events.emit('basket:remove', { id: this.cardId });
		});
	}

	// Идентификатор товара 
	set id(value: string) {
		this.cardId = value;
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}
}