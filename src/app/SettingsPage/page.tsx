import React from "react";
import Navbar from "../../components/Navbar";

const SettingPage = () => {
  return (
    <div className="w-screen min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="max-w-3xl mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Settings</h1>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>

          <div className="space-y-6">
            {/* Theme setting */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>
              <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-sm">
                Toggle
              </button>
            </div>

            {/* Notifications setting */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-sm">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6">Account</h2>

          <div className="space-y-6">
            {/* Change password */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Change Password</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                Update
              </button>
            </div>

            {/* Delete account */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Delete Account</span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingPage;
