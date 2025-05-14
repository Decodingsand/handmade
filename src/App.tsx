
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { MessageProvider } from "./contexts/MessageContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SellersPage from "./pages/SellersPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import ProductEditPage from "./pages/ProductEditPage";
import FavoritesPage from "./pages/FavoritesPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <CartProvider>
          <FavoritesProvider>
            <MessageProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/product/:sellerId/:productId" element={<ProductDetailPage />} />
                    <Route path="/sellers" element={<SellersPage />} />
                    <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
                    <Route path="/seller/products/new" element={<ProductEditPage />} />
                    <Route path="/seller/products/edit/:productId" element={<ProductEditPage />} />
                    <Route path="/seller/:sellerId/dashboard" element={<SellerDashboardPage />} />
                    <Route path="/seller/:sellerId/product/new" element={<ProductEditPage />} />
                    <Route path="/seller/:sellerId/product/:productId" element={<ProductEditPage />} />
                    <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </MessageProvider>
          </FavoritesProvider>
        </CartProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
