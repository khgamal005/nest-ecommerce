import { Controller } from '@nestjs/common';

@Controller('products')
export class ProductsController {

    public getAllProducts(): {}[] {
        return [
            {
                id: 1,
                name: 'Product 1',
                price: 100
            },
        ];
    }

}
