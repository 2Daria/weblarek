import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface ICardData {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number | null;
	description: string;
	inBasket: boolean;
	index: number;
}

interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

export class Card extends Component<ICardData> {
	protected _id: string = '';
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;
	protected _deleteButton?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector('.card__category') ?? undefined;
		this._image =
			(container.querySelector('.card__image') as HTMLImageElement) ?? undefined;
		this._description = container.querySelector('.card__text') ?? undefined;
		this._button =
			(container.querySelector('.card__button') as HTMLButtonElement) ?? undefined;
		this._index = container.querySelector('.basket__item-index') ?? undefined;
		this._deleteButton =
			(container.querySelector('.basket__item-delete') as HTMLButtonElement) ??
			undefined;

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', (e) => {
				e.stopPropagation();
				actions?.onClick?.(e);
			});
		} else if (this._button) {
			this._button.addEventListener('click', (e) => {
				e.stopPropagation();
				actions?.onClick?.(e);
			});
		} else if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this._id = value;
		this.container.dataset.id = value;
	}

	get id(): string {
		return this._id;
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set category(value: string) {
		if (!this._category) return;
		this._category.textContent = value;
		// Сбрасываем все возможные модификаторы и ставим нужный
		Object.values(categoryMap).forEach((cls) => this._category!.classList.remove(cls));
		const cls = categoryMap[value as keyof typeof categoryMap];
		if (cls) this._category.classList.add(cls);
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, CDN_URL + value, this._title.textContent ?? '');
		}
	}

	set description(value: string) {
		if (this._description) {
			this._description.textContent = value;
		}
	}

	set price(value: number | null) {
		this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
		if (this._button && value === null && !this._deleteButton) {
			this._button.disabled = true;
			this._button.textContent = 'Недоступно';
		}
	}

	set index(value: number) {
		if (this._index) this._index.textContent = String(value);
	}

	set inBasket(value: boolean) {
		if (this._button && !this._deleteButton) {
			if (this._button.disabled && this._button.textContent === 'Недоступно') return;
			this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
		}
	}
}