import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _description: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this._close.addEventListener('click', actions.onClick);
	}

	set total(value: number) {
		this._description.textContent = `Списано ${value} синапсов`;
	}
}