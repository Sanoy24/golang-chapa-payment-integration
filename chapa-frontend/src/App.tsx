import { useState } from "react";

export default function App() {
    const [formData, setFormData] = useState({
        amount: "",
        currency: "ETB",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        tx_ref: `chewatatest-asds`, // unique transaction reference
        // callback_url: "http://localhost:3000/callback",
        // return_url: "http://localhost:3000/success",
        "customization[title]": "Netsa Service",
        "customization[description]": "Payment for services",
        "meta[hide_receipt]": "false",
        return_url: "http://localhost:8080/payment-success",
        callback_url: "http://localhost:8080/chapa-callback",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:8080/initialize-paymnet",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            if (data?.data?.checkout_url) {
                window.location.href = data.data.checkout_url; // redirect user
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Payment Init Failed", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4">Initiate Payment</h2>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mb-2"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mb-2"
                    required
                />

                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mb-2"
                    required
                />

                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mb-2"
                />

                <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mb-4"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : "Initiate Payment"}
                </button>
            </form>
        </div>
    );
}
