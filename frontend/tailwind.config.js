/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // เปิดใช้งาน Dark Mode แบบใช้ Class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // สี Indigo เป็นสีหลัก
        secondary: '#10B981', // สี Emerald สำหรับความสำเร็จ/กำไร
        dark: '#1F2937', // สีพื้นหลัง Dark mode
      }
    },
  },
  plugins: [],
}