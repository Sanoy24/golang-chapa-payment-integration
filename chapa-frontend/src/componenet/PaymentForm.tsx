import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        amount: "",
        currency: "ETB",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState("");

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8080/initialize-payment",
                formData
            );
            console.log(response.data.data.checkout_url);
            if (response.data.data.checkout_url) {
                // setCheckoutUrl(response.data.checkout_url);
                window.location.href = response.data.data.checkout_url;
            }
        } catch (err: any) {
            setError(
                err.response?.data?.error || "Failed to initialize payment"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Make a Payment
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {checkoutUrl ? (
                <div className="text-center">
                    <p className="mb-4">
                        Payment initialized! Proceed to payment:
                    </p>
                    <a
                        href={checkoutUrl}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Complete Payment
                    </a>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Currency
                        </label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="ETB">ETB</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Initialize Payment"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaymentForm;
