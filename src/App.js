import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Provider, useSelector, useDispatch } from "react-redux";
import { createStore } from "redux";


// Actions
function increment(item) {
  return { type: "ADD_TO_CART", item: item, id: Math.random(), price: item.price};
}

function decrement(id, price) {
  return { type: "REMOVE_FROM_CART", id: id, price: price };
}

// Reducer
function reducer( state = { products: [], sum: 0}, action ) {
  console.log("products",state.products)
  switch (action.type) {
    case "ADD_TO_CART":
      console.log(action)
      return {
        ...state, // kopio statesta
        products: [...state.products, { item: action.item, id: action.id, price: action.price }],
        sum: state.sum + action.item.price
      }
    case "REMOVE_FROM_CART":
      const newCart = state.products.filter(product => product.id !== action.id);
      console.log(action)
      return {
        ...state,
        sum: state.sum - action.price,
        products: newCart
      }
    default: return state;
  }
}

function Cart() {
  // haetaan tietoa storesta
  const items = useSelector(state => state.products)
  const total = useSelector(state => state.sum)
  const dispatch = useDispatch()
  const remove = (id, price) => {
  dispatch(decrement(id, price))
  }
  
  return(
    <div>
      <h2>Shopping Cart</h2>  
        {items.map(item => (
          <div className="cartinfo" key={item.id}>
            <hr></hr>
            <button className="button2" onClick={() => remove(item.id, item.price)}> x </button>
            <img alt="pic" height="50px" src={item.item.image}></img>
            <li>{item.item.title}</li>
            <li>{item.item.price}€</li>
            <hr></hr>
          </div>
        ))}
       <h4 className="total">Total: {total.toFixed(2)}€</h4>
    </div>
  )
}

function App(props) {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data)
        //console.log(response.data)
      })
  }, [])

  const productItems = products.map( (product, index) => 
    <Product key={index} product={product}/>
  );

  
  function Product(props) {
    const dispatch = useDispatch()
    return(
      <div className="Product">
        <button className="button" onClick={() => dispatch(increment(props.product))}>Buy</button>
        <img className="cartimg" src={props.product.image} height="100px" alt="pic"></img>
        <p><strong>{props.product.title}</strong></p>
        <p><strong>{props.product.price}€</strong></p>
        <ul className="info">
          <li>{props.product.description}</li><br></br>
          <li>{props.product.category}</li>   
        </ul>
      </div>
    )
  }
 
  const store = createStore(reducer)
  
  return (
    <Provider store={store}>
      <div>
        <div className="column1">
          <h2>Products</h2>
          {productItems}
        </div>
        <div className="column2">
          <Cart />
        </div>
      </div>
    </Provider>

  );
}

export default App;