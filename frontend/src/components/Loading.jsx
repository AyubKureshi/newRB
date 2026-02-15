const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-gray-300">
      <img
        src="/images/progress.gif"
        alt="Loading"
        className="w-20 h-20 object-contain"
      />
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default Loading;
