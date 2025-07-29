import React from "react";
import Navbar from "../../components/Navbar";

const AccountPage = () => {
  return (
    <div className="w-screen min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="max-w-3xl mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Account</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
              JD
            </div>
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-500 text-sm">johndoe@example.com</p>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-600">
              Update your personal information and preferences.
            </p>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
