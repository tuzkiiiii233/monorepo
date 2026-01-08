import { greet, add, formatDate } from "@demo/common-utils";

export default function Home() {
  const today = new Date();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">App A - Next.js Demo</h1>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-lg">{greet("张三")}</p>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <p className="text-lg">1 + 2 = {add(1, 2)}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <p className="text-lg">今天是: {formatDate(today)}</p>
        </div>
      </div>
    </main>
  );
}
// test
