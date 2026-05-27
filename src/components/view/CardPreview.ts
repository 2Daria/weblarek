import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ICardPreview } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<ICardPreview> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected textElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
		this.textElement = ensureElement<HTMLElement>('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

		this.buttonElement.addEventListener('click', () => {
			this.events.emit('preview:toggle');
		});
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

	set description(value: string) {
		this.textElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent =
			value === null ? 'Бесценно' : `${value} синапсов`;

		if (value === null) {
			this.buttonElement.disabled = true;
			this.buttonElement.textContent = 'Недоступно';
		} else {
			this.buttonElement.disabled = false;
		}
	}

	set inBasket(value: boolean) {
		if (this.buttonElement.disabled) return;
		this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
	}
}