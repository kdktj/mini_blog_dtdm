/**
 * Test Component để verify Tailwind CSS hoạt động
 * Xóa file này sau khi verify xong
 */
export default function TailwindTest() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-primary-500 mb-4">
        Tailwind CSS Test
      </h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Testing Colors
        </h2>
        <div className="flex gap-2 mb-4">
          <div className="w-16 h-16 bg-primary-500 rounded-lg"></div>
          <div className="w-16 h-16 bg-secondary-500 rounded-lg"></div>
          <div className="w-16 h-16 bg-red-500 rounded-lg"></div>
          <div className="w-16 h-16 bg-green-500 rounded-lg"></div>
        </div>
      </div>

      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
        Test Button
      </button>
    </div>
  );
}
