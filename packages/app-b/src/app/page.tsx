import { greet, add, formatDate } from "@demo/common-utils";

export default function Home() {
  const today = new Date();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-indigo-600">
        App B - Next.js Demo
      </h1>

      <div className="space-y-4 max-w-2xl">
        <div className="p-6 bg-white shadow rounded-lg">
          <p className="text-xl">{greet("李四")}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <p className="text-xl">5 + 3 = {add(5, 3)}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <p className="text-xl">今天是: {formatDate(today)}</p>
        </div>
      </div>
    </main>
  );
}
