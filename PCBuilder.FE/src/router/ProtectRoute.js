import { useNavigate } from "react-router-dom";

const useRedirectToPaymentOrLogin = () => {
  const navigate = useNavigate();

  const redirectToPaymentOrLogin = (isLoggedIn, product) => {
    if (isLoggedIn) {
      navigate(
        `/payment?url=${product.url}&price=${product.price}&pcId=${
          product.id
        }&name=${encodeURIComponent(product.name)}`
      );
    } else {
      navigate("/login");
    }
  };

  return redirectToPaymentOrLogin;
};

export default useRedirectToPaymentOrLogin;
