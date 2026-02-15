export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="shape bg-pink-400 top-10 left-10"></div>
      <div className="shape bg-indigo-400 top-80 right-10"></div>
      <div className="shape bg-purple-400 bottom-10 left-1/4"></div>
      <div className="shape bg-yellow-400 top-40 left-80"></div>
      <div className="shape bg-yellow-400 top-5 right-80"></div>
    </div>
  );
}
