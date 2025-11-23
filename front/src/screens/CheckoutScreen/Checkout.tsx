import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

type Props = {
  email: string;
}

function Checkout({ email }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokenCheckout() {
      const resp = await fetch('http://localhost:7777/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await resp.json();
      setToken(json?.client_secret);
      return json;
    }
    getTokenCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmbeddedCheckoutProvider
      stripe={loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)}
      options={{ clientSecret: token }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export default Checkout