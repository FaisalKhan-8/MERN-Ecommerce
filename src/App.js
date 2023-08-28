import { useEffect } from 'react';
import './App.css';
import Protected from './features/auth/components/Protected';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/SignupPage';
import { Route, Routes } from 'react-router';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './features/auth/authSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';

import UserOrdersPage from './pages/UserOrdersPage';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className='App'>
      <Routes>
        <Route index path='/' element={<Protected>{<Home />}</Protected>} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/cart' element={<Protected>{<CartPage />}</Protected>} />
        <Route
          path='/checkout'
          element={<Protected>{<Checkout />}</Protected>}
        />
        <Route
          path='/product-detail/:id'
          element={<Protected>{<ProductDetailPage />}</Protected>}
        />
        <Route path='order-success/:id' element={<OrderSuccessPage />} />
        <Route path='/orders' element={<UserOrdersPage />} /> // we will add
        page later right now using component directly
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
