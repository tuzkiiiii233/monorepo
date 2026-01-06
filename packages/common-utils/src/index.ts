// 共享的工具函数
export function greet(name: string): string {
  return `你好, ${name}!`;
}

export function add(a: number, b: number): number {
  return a + b;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN");
}
