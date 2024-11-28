import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [amount, setAmount] = useState(0);
    const [orderId, setOrderId] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/payments', { amount });
            const { order_id, key, currency } = response.data;

            const options = {
                key,
                amount: amount * 100,
                currency,
                name: "The C Learning Hub",
                description: "first Transaction",
                order_id,
                // handler: function (response) {
                //     alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                // },
                handler: async function (response) {
                    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Send payment ID back to the Rails server to update status
                    await axios.post('http://localhost:3000/api/v1/payments/update_payment_status', {
                        order_id: order_id,
                        razorpay_payment_id: response.razorpay_payment_id
                    });
                },

                prefill: {
                    name: "Rajan",
                    email: "your.email@example.com",
                    contact: "1212523235"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default PaymentForm;
