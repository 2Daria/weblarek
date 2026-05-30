import { Card } from './Card';
import { ICardActions, ICardCatalog } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card<ICardCatalog> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

		container.addEventListener('click', actions.onClick);
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