import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY!);

type Props = {
  email: string;
}

function Checkout({ email }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokenCheckout() {
      const resp = await fetch('https://entrevista-ja.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await resp.json();

      setToken(json?.client_secret);
      return json;
    }
    getTokenCheckout();

  }, [email]);


  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: token }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export default Checkout
