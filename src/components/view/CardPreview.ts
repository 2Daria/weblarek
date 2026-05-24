import { Card } from './Card';
import { ICardPreview, ICardActions } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<ICardPreview> {
	protected imageElement: HTMLImageElement;
	protected textElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);
		this.textElement = ensureElement<HTMLElement>('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		this.buttonElement.addEventListener('click', actions.onClick);
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
		}
	}

	set inBasket(value: boolean) {
		if (this.buttonElement.disabled) return;
		this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
	}
}