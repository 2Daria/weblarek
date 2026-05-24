import { Component } from '../base/Component';
import { ICard } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Card<T = object> extends Component<ICard & T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected categoryElement: HTMLElement | null;

	constructor(container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
		this.categoryElement = container.querySelector('.card__category');
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent =
			value === null ? 'Бесценно' : `${value} синапсов`;
	}

	set category(value: string) {
		if (!this.categoryElement) return;
		this.categoryElement.textContent = value;
		// Сбрасываем все возможные модификаторы категории и ставим нужный
		Object.values(categoryMap).forEach((className) =>
			this.categoryElement!.classList.remove(className)
		);
		const modifier = categoryMap[value as keyof typeof categoryMap];
		if (modifier) this.categoryElement.classList.add(modifier);
	}
}