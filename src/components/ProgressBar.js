export default function ProgressBar({ step, steps }) {
  return (
    <div className='mb-8'>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-in-out'
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      <div className='flex justify-between mt-2'>
        {steps.map((s, index) => (
          <span
            key={index}
            className={`text-sm ${
              step >= index ? 'text-purple-600 font-medium' : 'text-gray-400'
            }`}
          >
            {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}
