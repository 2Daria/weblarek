import { IProduct } from '../../types';

export class Catalog {
	protected items: IProduct[] = [];
	protected selected: IProduct | null = null;

	setItems(items: IProduct[]): void {
		this.items = items;
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setSelectedItem(item: IProduct): void {
		this.selected = item;
	}

	getSelectedItem(): IProduct | null {
		return this.selected;
	}
}