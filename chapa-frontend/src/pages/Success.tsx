const Success = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
                <p className="text-green-500">Thank you for your payment.</p>
                <a
                    href="/"
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Home
                </a>
            </div>
        </div>
    );
};

export default Success;
