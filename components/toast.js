export default function toast(message) {
  if (typeof window !== "undefined") {
    alert(message); // simple replacement for now
  }
}
