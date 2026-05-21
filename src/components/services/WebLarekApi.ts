import {
	IApi,
	IProductListResponse,
	IOrderRequest,
	IOrderResponse,
} from '../../types';

export class WebLarekApi {
	constructor(protected api: IApi) {}

	getProducts(): Promise<IProductListResponse> {
		return this.api.get<IProductListResponse>('/product/');
	}

	orderProducts(order: IOrderRequest): Promise<IOrderResponse> {
		return this.api.post<IOrderResponse>('/order/', order);
	}
}