const Failure = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
                <p className="text-red-500">
                    Something went wrong with your payment. Please try again.
                </p>
                <a
                    href="/"
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Try Again
                </a>
            </div>
        </div>
    );
};

export default Failure;
