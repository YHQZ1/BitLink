export default function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-neutral-400 text-sm">{label}</p>
      </div>
    </div>
  );
}
