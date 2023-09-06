import { useEffect } from 'react';
import './App.css';
import Protected from './features/auth/components/Protected';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/SignupPage';
import { Route, Routes, Link } from 'react-router';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked,
} from './features/auth/authSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserProfilePage from './pages/UserProfilePage';
import UserOrdersPage from './pages/UserOrdersPage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import Logout from './features/auth/components/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminHome from './pages/AdminHome';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_LEFT,
};

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <div className='App'>
      {userChecked && (
        <Provider template={AlertTemplate} {...options}>
          <Routes>
            <Route index path='/' element={<Protected>{<Home />}</Protected>} />
            <Route
              index
              path='/admin'
              element={<ProtectedAdmin>{<AdminHome />}</ProtectedAdmin>}
            />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route
              path='/admin/product-detail/:id'
              element={
                <ProtectedAdmin>{<AdminProductDetailPage />}</ProtectedAdmin>
              }
            />
            <Route
              path='/admin/product-form'
              element={
                <ProtectedAdmin>{<AdminProductFormPage />}</ProtectedAdmin>
              }
            />
            <Route
              path='/admin/orders'
              element={<ProtectedAdmin>{<AdminOrdersPage />}</ProtectedAdmin>}
            />
            <Route
              path='/admin/product-form/edit/:id'
              element={
                <ProtectedAdmin>{<AdminProductFormPage />}</ProtectedAdmin>
              }
            />
            <Route
              path='/cart'
              element={<Protected>{<CartPage />}</Protected>}
            />
            <Route
              path='/checkout'
              element={<Protected>{<Checkout />}</Protected>}
            />
            <Route
              path='/product-detail/:id'
              element={<Protected>{<ProductDetailPage />}</Protected>}
            />
            <Route
              path='order-success/:id'
              element={<Protected>{<OrderSuccessPage />}</Protected>}
            />
            <Route
              path='/orders'
              element={<Protected>{<UserOrdersPage />}</Protected>}
            />
            // we will add page later right now using component directly
            <Route
              path='/profile'
              element={<Protected>{<UserProfilePage />}</Protected>}
            />
            <Route path='/logout' element={<Logout />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Provider>
      )}
    </div>
  );
}

export default App;
