import { IProduct } from '../../types';
import { IEvents } from '../base/Events';


export class Products {
	protected items: IProduct[] = [];

	protected selectedItem: IProduct | null = null;

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]): void {
		this.items = items;
		this.events.emit('catalog:changed');
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setSelectedItem(item: IProduct): void {
		this.selectedItem = item;
		this.events.emit('preview:changed', item);
	}

	getSelectedItem(): IProduct | null {
		return this.selectedItem;
	}
}