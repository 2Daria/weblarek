import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { WebLarekApi } from './components/services/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { IProduct } from './types';

const testItems = apiProducts.items as IProduct[];

// ProductsModel
console.log('===== Проверка модели каталога (Products) =====');

const productsModel = new Products();

productsModel.setItems(testItems);
console.log('Массив товаров из каталога:', productsModel.getItems());

const firstId = testItems[0].id;
console.log('Получение товара по id:', productsModel.getItemById(firstId));

productsModel.setSelectedItem(testItems[1]);
console.log('Выбранный для просмотра товар:', productsModel.getSelectedItem());

// BasketModel
console.log('===== Проверка модели корзины (Basket) =====');

const basketModel = new Basket();

basketModel.addItem(testItems[0]);
basketModel.addItem(testItems[1]);
console.log('Товары в корзине после добавления:', basketModel.getItems());

console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость товаров в корзине:', basketModel.getTotalPrice());
console.log('Есть ли товар в корзине (по id):', basketModel.hasItem(firstId));

basketModel.removeItem(testItems[0]);
console.log('Товары в корзине после удаления:', basketModel.getItems());

basketModel.clear();
console.log('Товары в корзине после очистки:', basketModel.getItems());

//const api = new WebLarekApi(new Api(API_URL));
const baseApi = new Api(API_URL);
const api = new WebLarekApi(baseApi);

api
	.getProducts()
	.then((data) => {
		console.log('===== Данные, полученные с сервера =====');
		console.log('Объект с сервера:', data);

		productsModel.setItems(data.items);
		console.log('Каталог, сохранённый в модель из ответа сервера:', productsModel.getItems());
	})
	.catch((error) => {
		console.error('Ошибка при запросе товаров с сервера:', error);
	});

// BuyerModel
//console.log('Данные после сохранения оплаты и адреса:', buyerModel.getData());
console.log('===== Проверка модели покупателя (Buyer) =====');
const buyerModel = new Buyer();
buyerModel.setData({ email: 'test@test.ru' });
console.log('Данные после добавления только email (остальные сохранены):', buyerModel.getData());

buyerModel.setData({ phone: '+79990001122' });
console.log('Данные после добавления телефона:', buyerModel.getData());

console.log('Валидация полностью заполненных данных:', buyerModel.validate());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());
console.log('Валидация пустых данных:', buyerModel.validate());

api
	.getProducts()
	.then((data) => {
		console.log('===== Данные, полученные с сервера =====');
		console.log('Объект с сервера:', data);

		productsModel.setItems(data.items);
		console.log('Каталог, сохранённый в модель из ответа сервера:', productsModel.getItems());
	})
	.catch((error) => {
		console.error('Ошибка при запросе товаров с сервера:', error);
	});