import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ICardCatalog } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card<ICardCatalog> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected cardId = '';

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

		container.addEventListener('click', () => {
			this.events.emit('card:select', { id: this.cardId });
		});
	}

	// Идентификатор товара
	set id(value: string) {
		this.cardId = value;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		Object.values(categoryMap).forEach((className) =>
			this.categoryElement.classList.remove(className)
		);
		const modifier = categoryMap[value as keyof typeof categoryMap];
		if (modifier) this.categoryElement.classList.add(modifier);
	}

	set image(value: string) {
		this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent ?? '');
	}
}