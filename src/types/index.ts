export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	get<T extends object>(uri: string): Promise<T>;
	post<T extends object>(
		uri: string,
		data: object,
		method?: ApiPostMethods
	): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBuyer {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
	total: number;
	items: string[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

// View

export interface IPageData {
	counter: number;
	catalog: HTMLElement[];
}

export interface IModalData {
	content: HTMLElement;
}

export interface ICard {
	title: string;
	category: string;
	price: number | null;
}

export interface ICardCatalog extends ICard {
	image: string;
}

export interface ICardPreview extends ICardCatalog {
	description: string;
	inBasket: boolean;
}

export interface ICardBasket {
	title: string;
	price: number | null;
	index: number;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	isEmpty: boolean;
}

export interface IFormState {
	valid: boolean;
	errors: string;
}

export interface IOrderFormData {
	payment: TPayment;
	address: string;
}

export interface IContactsFormData {
	email: string;
	phone: string;
}

export interface ISuccessData {
	total: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
	onClick: () => void;
}