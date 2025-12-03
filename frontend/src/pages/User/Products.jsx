import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/productApi';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts().then(res => setProducts(res.data));
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map(p => (
                    <li key={p.id}>{p.name} - ${p.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
