const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="text-green-600"
      >
        {/* Leaf Icon */}
        <path
          d="M20 2C10.058 2 2 10.058 2 20s8.058 18 18 18 18-8.058 18-18S29.942 2 20 2zm0 34C11.163 36 4 28.837 4 20S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z"
          fill="currentColor"
        />
        <path
          d="M20 6c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zm0 26c-6.627 0-12-5.373-12-12S13.373 8 20 8s12 5.373 12 12-5.373 12-12 12z"
          fill="currentColor"
        />
        <path
          d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
          fill="currentColor"
        />
        <path
          d="M20 14c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"
          fill="currentColor"
        />
      </svg>
      {/* Text */}
      <span className="text-2xl font-bold text-green-800">FarmEase</span>
    </div>
  );
};

export default Logo;