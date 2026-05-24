import { Component } from '../base/Component';
import { ISuccessData, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccessData> {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', actions.onClick);
	}

	set total(value: number) {
		this.descriptionElement.textContent = `Списано ${value} синапсов`;
	}
}