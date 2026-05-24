import { Card } from './Card';
import { ICardCatalog, ICardActions } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card<ICardCatalog> {
	protected imageElement: HTMLImageElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);

		container.addEventListener('click', actions.onClick);
	}

	set image(value: string) {
		this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent ?? '');
	}
}