import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { WebLarekApi } from './components/services/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { IBuyer, IOrderRequest } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

//const testItems = apiProducts.items as IProduct[];

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const api = new WebLarekApi(new Api(API_URL));

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
//const success = new Success(cloneTemplate(successTemplate), {
	//onClick: () => modal.close(),
//});
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Обработчики
events.on('catalog:changed', () => {
	const cards = productsModel.getItems().map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
		return card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			price: item.price,
			image: item.image,
		});
	});
	page.render({ catalog: cards });
});

events.on('card:select', (payload: { id: string }) => {
	const item = productsModel.getItemById(payload.id);
	if (item) productsModel.setSelectedItem(item);
});

events.on('preview:changed', () => {
	const item = productsModel.getSelectedItem();
	if (!item) return;
	modal.content = cardPreview.render({
		title: item.title,
		category: item.category,
		price: item.price,
		image: item.image,
		description: item.description,
		inBasket: basketModel.hasItem(item.id),
	});
	modal.open();
});

events.on('preview:toggle', () => {
	const item = productsModel.getSelectedItem();
	if (!item) return;
	if (basketModel.hasItem(item.id)) {
		basketModel.removeItem(item);
	} else {
		basketModel.addItem(item);
	}
	modal.close();
});

events.on('basket:remove', (payload: { id: string }) => {
	const item = basketModel.getItems().find((it) => it.id === payload.id);
	if (item) basketModel.removeItem(item);
});

events.on('basket:changed', () => {
	page.counter = basketModel.getCount();

	const items = basketModel.getItems().map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	basketView.render({
		items,
		total: basketModel.getTotalPrice(),
		isEmpty: basketModel.getCount() === 0,
	});
});

events.on('basket:open', () => {
	modal.content = basketView.render();
	modal.open();
});

events.on('order:open', () => {
	const errors = buyerModel.validate();
	const data = buyerModel.getData();
	modal.content = orderForm.render({
		payment: data.payment,
		address: data.address,
		valid: !errors.payment && !errors.address,
		errors: [errors.payment, errors.address].filter(Boolean).join('; '),
	});
	modal.open();
});

events.on('order:submit', () => {
	const errors = buyerModel.validate();
	const data = buyerModel.getData();
	modal.content = contactsForm.render({
		email: data.email,
		phone: data.phone,
		valid: !errors.email && !errors.phone,
		errors: [errors.email, errors.phone].filter(Boolean).join('; '),
	});
	modal.open();
});

events.on(
	/^(order|contacts)\..*:change/,
	(payload: { field: keyof IBuyer; value: string }) => {
		buyerModel.setData({ [payload.field]: payload.value });
	}
);

events.on('buyer:changed', () => {
	const errors = buyerModel.validate();
	const data = buyerModel.getData();

	orderForm.render({
		payment: data.payment,
		address: data.address,
		valid: !errors.payment && !errors.address,
		errors: [errors.payment, errors.address].filter(Boolean).join('; '),
	});

	contactsForm.render({
		email: data.email,
		phone: data.phone,
		valid: !errors.email && !errors.phone,
		errors: [errors.email, errors.phone].filter(Boolean).join('; '),
	});
});

events.on('contacts:submit', () => {
	const data = buyerModel.getData();
	const order: IOrderRequest = {
		...data,
		total: basketModel.getTotalPrice(),
		items: basketModel
			.getItems()
			.filter((item) => item.price !== null)
			.map((item) => item.id),
	};

	api
		.orderProducts(order)
		.then((result) => {
			modal.content = success.render({ total: result.total });
			modal.open();
			basketModel.clear();
			buyerModel.clear();
		})
		.catch((error) => {
			console.error('Ошибка при оформлении заказа:', error);
		});
});

events.on('success:close', () => {
	modal.close();
});

api
	.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);
	})
	.catch((error) => {
		console.error('Ошибка при запросе товаров с сервера:', error);
	});