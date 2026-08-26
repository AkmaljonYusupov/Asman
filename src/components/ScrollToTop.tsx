import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Har bir marshrut almashganda sahifani yuqoriga (hero boshidan) qaytaradi.
 *
 * useLayoutEffect ishlatilgan — u brauzer yangi kadrni chizishidan OLDIN
 * sinxron ishlaydi, shuning uchun eski scroll pozitsiyasi bir lahzaga ham
 * "yalt" etib ko'rinmaydi (useEffect'dan farqli o'laroq, u chizilgandan
 * KEYIN ishlaydi va shu bir lahzalik "flash" xatoligini beradi).
 *
 * Agar havolada #hash bo'lsa (masalan /contacts#form), yuqoriga emas,
 * o'sha bo'limga scroll qilinishi kerak — shuning uchun hash mavjud
 * bo'lganda bu komponent aralashmaydi.
 */
export const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};