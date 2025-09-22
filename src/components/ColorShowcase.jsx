import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ColorShowcase = () => {
  const { isDark, toggleTheme, currentColors, colorPalette } = useTheme();

  const colorGroups = [
    {
      title: 'الألوان الأساسية الأربعة',
      colors: [
        { name: 'أسود/غامق', value: colorPalette.dark, class: 'bg-nsr-dark' },
        { name: 'أبيض/فاتح', value: colorPalette.light, class: 'bg-nsr-light' },
        { name: 'أزرق باهت فخم', value: colorPalette.secondary, class: 'bg-nsr-secondary' },
        { name: 'تركواز معدني', value: colorPalette.accent, class: 'bg-nsr-accent' },
      ]
    },
    {
      title: 'تدرجات الألوان',
      colors: [
        { name: 'تدرج أنيق', class: 'gradient-nsr-elegant' },
        { name: 'تدرج غروب', class: 'gradient-nsr-sunset' },
        { name: 'تدرج قوس قزح', class: 'gradient-nsr-rainbow' },
        { name: 'تدرج دائري', class: 'gradient-nsr-radial' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-nsr-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4 animate-fadeIn">
            🎨 نظام الألوان الجديد الممتاز
          </h1>
          <p className="text-lg text-nsr-light-200 mb-6">
            عرض تفاعلي للألوان الأربعة الأساسية مع الوضع المظلم والفاتح
          </p>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-primary hover-glow animate-pulse"
          >
            {isDark ? '🌞' : '🌙'} تبديل إلى الوضع {isDark ? 'الفاتح' : 'المظلم'}
          </button>
        </div>

        {/* Color Groups */}
        {colorGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-12">
            <h2 className="text-2xl font-semibold text-nsr-secondary mb-6 text-shadow">
              {group.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="card-nsr-elegant hover-lift animate-fadeIn"
                  style={{ animationDelay: `${colorIndex * 0.1}s` }}
                >
                  <div
                    className={`w-full h-32 rounded-lg mb-4 ${color.class} shadow-nsr-glow`}
                  ></div>
                  <h3 className="text-lg font-medium text-nsr-light mb-2">
                    {color.name}
                  </h3>
                  {color.value && (
                    <p className="text-sm text-nsr-light-300 font-mono">
                      {color.value}
                    </p>
                  )}
                  <p className="text-xs text-nsr-light-400 mt-2">
                    {color.class}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Interactive Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-nsr-secondary mb-6 text-shadow">
            أمثلة تفاعلية
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <div className="card-nsr">
              <h3 className="text-lg font-medium text-nsr-light mb-4">الأزرار</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full">زر أساسي</button>
                <button className="btn-secondary w-full">زر ثانوي</button>
                <button className="bg-nsr-accent text-nsr-light px-4 py-2 rounded-lg hover-glow w-full">
                  زر مخصص
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="card-nsr">
              <h3 className="text-lg font-medium text-nsr-light mb-4">البطاقات</h3>
              <div className="space-y-3">
                <div className="card-nsr bg-nsr-secondary-100 text-nsr-dark">
                  بطاقة عادية
                </div>
                <div className="card-nsr-elegant">
                  بطاقة أنيقة
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="card-nsr">
              <h3 className="text-lg font-medium text-nsr-light mb-4">الحقول</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="حقل إدخال عادي"
                  className="input-nsr"
                />
                <input
                  type="text"
                  placeholder="حقل مخصص"
                  className="w-full px-4 py-2 bg-nsr-light-100 text-nsr-dark border-2 border-nsr-secondary rounded-lg focus:border-nsr-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="card-nsr-elegant text-center">
          <h3 className="text-xl font-semibold text-nsr-light mb-4">
            معلومات الوضع الحالي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-nsr-light-300">الوضع الحالي:</p>
              <p className="text-nsr-secondary font-semibold">
                {isDark ? 'مظلم' : 'فاتح'}
              </p>
            </div>
            <div>
              <p className="text-nsr-light-300">اللون الأساسي:</p>
              <p className="text-nsr-secondary font-semibold">
                {currentColors.primary}
              </p>
            </div>
            <div>
              <p className="text-nsr-light-300">لون النص:</p>
              <p className="text-nsr-secondary font-semibold">
                {currentColors.text}
              </p>
            </div>
            <div>
              <p className="text-nsr-light-300">اللون الأكسنت:</p>
              <p className="text-nsr-secondary font-semibold">
                {currentColors.accent}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-nsr-light-300">
            تم إنشاء هذا النظام ليوفر تجربة بصرية ممتازة ومتسقة
          </p>
          <p className="text-nsr-accent text-sm mt-2">
            🎨 نظام الألوان الجديد الممتاز - NSR Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorShowcase;
