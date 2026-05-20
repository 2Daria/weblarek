import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _basketButton: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this._gallery = ensureElement<HTMLElement>('.gallery', container);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this._basketButton.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this._counter.textContent = String(value);
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) this._wrapper.classList.add('page__wrapper_locked');
		else this._wrapper.classList.remove('page__wrapper_locked');
	}
}