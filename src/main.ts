import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ShopApi } from './components/services/ShopApi';

import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Card } from './components/views/Card';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	IProduct,
	IBuyer,
	TPayment,
	IOrderRequest,
} from './types';

const events = new EventEmitter();

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();
const shopApi = new ShopApi(new Api(API_URL));

console.group('%c=== Проверка моделей данных ===', 'color:#83FA9D;font-weight:bold');

console.group('Catalog');
catalog.setItems(apiProducts.items as IProduct[]);
console.log('Массив товаров из каталога:', catalog.getItems());
console.log('Получение товара по id:', catalog.getItemById(apiProducts.items[0].id));
catalog.setSelectedItem(apiProducts.items[1] as IProduct);
console.log('Сохранён выбранный товар:', catalog.getSelectedItem());
console.groupEnd();

console.group('Basket');
basket.addItem(apiProducts.items[0] as IProduct);
basket.addItem(apiProducts.items[1] as IProduct);
basket.addItem(apiProducts.items[3] as IProduct);
console.log('Содержимое корзины:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость:', basket.getTotalPrice());
console.log('Есть ли товар id =', apiProducts.items[0].id, '?', basket.hasItem(apiProducts.items[0].id));
console.log('Есть ли несуществующий товар?', basket.hasItem('non-existing-id'));
basket.removeItem(apiProducts.items[0] as IProduct);
console.log('После удаления первого товара:', basket.getItems());
basket.clear();
console.log('После очистки корзины:', basket.getItems(), 'count:', basket.getCount());
console.groupEnd();

console.group('Buyer');
buyer.setData({ payment: 'card', address: 'Москва, ул. Пушкина, д. 1' });
console.log('После сохранения payment+address:', buyer.getData());
buyer.setData({ email: 'test@example.com' });
console.log('После добавления email (другие поля сохранены):', buyer.getData());
buyer.setData({ phone: '+79991234567' });
console.log('После добавления телефона:', buyer.getData());
console.log('Валидация (всё заполнено):', buyer.validate());
buyer.setData({ address: '' });
console.log('Валидация после очистки address:', buyer.validate());
buyer.clear();
console.log('После очистки покупателя:', buyer.getData());
console.log('Валидация пустого покупателя:', buyer.validate());
console.groupEnd();

console.groupEnd();

shopApi
	.getProducts()
	.then((response) => {
		console.group('%c=== Каталог получен с сервера ===', 'color:#83DDFA;font-weight:bold');
		console.log('Объект, полученный с сервера:', response);
		catalog.setItems(response.items);
		console.log('Каталог после сохранения в модель:', catalog.getItems());
		console.groupEnd();
		events.emit('catalog:changed');
	})
	.catch((err) => {
		console.error('Ошибка при загрузке каталога:', err);
	});
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);

const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsForm = new ContactsForm(
	cloneTemplate<HTMLFormElement>(contactsTemplate),
	events
);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const success = new Success(cloneTemplate<HTMLElement>(successTemplate), {
	onClick: () => modal.close(),
});

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new BasketView(cloneTemplate<HTMLElement>(basketTemplate), events);

events.on('catalog:changed', () => {
	const cards = catalog.getItems().map((item) => {
		const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
		const card = new Card(cloneTemplate<HTMLElement>(cardTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
		});
	});
	page.render({ gallery: cards, counter: basket.getCount() });
});

events.on('card:select', (item: IProduct) => {
	catalog.setSelectedItem(item);
	const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
	const card = new Card(cloneTemplate<HTMLElement>(previewTemplate), {
		onClick: () => {
			if (basket.hasItem(item.id)) {
				basket.removeItem(item);
			} else {
				basket.addItem(item);
			}
			events.emit('basket:changed');
			modal.close();
		},
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
			description: item.description,
			inBasket: basket.hasItem(item.id),
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = basket.getCount();
	renderBasket();
});

function renderBasket() {
	const items = basket.getItems().map((item, idx) => {
		const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
		const card = new Card(cloneTemplate<HTMLElement>(itemTemplate), {
			onClick: () => {
				basket.removeItem(item);
				events.emit('basket:changed');
			},
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: idx + 1,
		});
	});
	basketView.render({
		items,
		total: basket.getTotalPrice(),
		valid: basket.getCount() > 0,
	});
}

events.on('basket:open', () => {
	renderBasket();
	modal.render({ content: basketView.render() });
});

events.on('order:open', () => {
	const data = buyer.getData();
	const errors = buyer.validate();
	modal.render({
		content: orderForm.render({
			payment: data.payment,
			address: data.address,
			valid: !errors.payment && !errors.address,
			errors: [errors.payment, errors.address].filter(Boolean).join('; '),
		}),
	});
});

events.on(
	/^order\..*:change/,
	(payload: { field: keyof IBuyer; value: string }) => {
		buyer.setData({ [payload.field]: payload.value } as Partial<IBuyer>);
		const data = buyer.getData();
		const errors = buyer.validate();
		orderForm.render({
			payment: data.payment as TPayment,
			address: data.address,
			valid: !errors.payment && !errors.address,
			errors: [errors.payment, errors.address].filter(Boolean).join('; '),
		});
	}
);

events.on('order:submit', () => {
	const data = buyer.getData();
	const errors = buyer.validate();
	modal.render({
		content: contactsForm.render({
			email: data.email,
			phone: data.phone,
			valid: !errors.email && !errors.phone,
			errors: [errors.email, errors.phone].filter(Boolean).join('; '),
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(payload: { field: keyof IBuyer; value: string }) => {
		buyer.setData({ [payload.field]: payload.value } as Partial<IBuyer>);
		const data = buyer.getData();
		const errors = buyer.validate();
		contactsForm.render({
			email: data.email,
			phone: data.phone,
			valid: !errors.email && !errors.phone,
			errors: [errors.email, errors.phone].filter(Boolean).join('; '),
		});
	}
);

events.on('contacts:submit', () => {
	const data = buyer.getData();
	const order: IOrderRequest = {
		payment: data.payment,
		address: data.address,
		email: data.email,
		phone: data.phone,
		total: basket.getTotalPrice(),
		items: basket
			.getItems()
			.filter((it) => it.price !== null) // товары без цены в заказ не идут
			.map((it) => it.id),
	};
	shopApi
		.orderProducts(order)
		.then((response) => {
			console.log('Заказ оформлен:', response);
			basket.clear();
			buyer.clear();
			page.counter = 0;
			modal.render({ content: success.render({ total: response.total }) });
		})
		.catch((err) => {
			console.error('Ошибка оформления заказа:', err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});
events.on('modal:close', () => {
	page.locked = false;
});