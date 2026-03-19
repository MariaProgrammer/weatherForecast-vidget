import { render, screen, fireEvent } from '@testing-library/vue';
import App from '../src/App.vue';

// -----------------
// СТАБЫ КОМПОНЕНТОВ
// -----------------
const StatStub = {
  props: ['label', 'stat'],
  template: `<div data-testid="stat"><span>{{ label }}</span> <strong>{{ stat }}</strong></div>`
};

const CityselectStub = {
  // Стаб даёт текстовое поле и кнопку; по клику эмитит 'select-city' со значением
  template: `
    <div>
      <input data-testid="city-input" v-model="city" />
      <button data-testid="select-btn" @click="$emit('select-city', city)">Найти</button>
    </div>
  `,
  data() {
    return { city: '' };
  }
};

const ErrorStub = {
  props: ['error'],
  template: `<div v-if="error" data-testid="error">{{ error }}</div>`
};

const DayCardStub = { template: `<div class="day-card"></div>` };

// -----------------
// УТИЛИТЫ ДЛЯ МОКОВ
// -----------------
function makeWeather({ humidity, precip, windspeed, pressure }) {
  // Возвращаем минимальный JSON, который ожидает ваш код
  const baseDate = new Date('2026-03-19');
  const days = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return {
      datetime: d.toISOString().slice(0, 10),
      icon: 'clear-day',
      temp: 20 + i,
      // Поля для сегодняшнего дня (days[0]) — именно их ваш код читает:
      humidity: i === 0 ? humidity : 50,
      precip: i === 0 ? precip : 0,
      windspeed: i === 0 ? windspeed : 3.6,
      pressure: i === 0 ? pressure : 1000
    };
  });
  return { days };
}

// Общий рендер с нужными стабами
function renderApp() {
  return render(App, {
    global: {
      stubs: {
        Stat: StatStub,
        Cityselect: CityselectStub,
        ErrorComponent: ErrorStub,
        DayCard: DayCardStub
      }
    }
  });
}

describe('App.vue (виджет погоды)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Тест 1 (успех): ввод города → клик → отображение города и статов за сегодня', async () => {
    // Мокаем fetch: первый вызов — для "Санкт-Петербург" при монтировании,
    // второй — для введённого города ("Москва")
    const mockFetch = vi.fn(async (arg) => {
      const urlStr = typeof arg === 'string' ? arg : arg.url;
      if (urlStr.includes(encodeURIComponent('Москва'))) {
        // Для Москвы отдадим влажность 77% и т.п.
        return {
          ok: true,
          json: async () =>
            makeWeather({ humidity: 77, precip: 2, windspeed: 3.6, pressure: 1000 })
        };
      }
      // Дефолтный ответ для начальной загрузки ("Санкт-Петербург")
      return {
        ok: true,
        json: async () =>
          makeWeather({ humidity: 55, precip: 1, windspeed: 3.6, pressure: 1000 })
      };
    });

    vi.stubGlobal('fetch', mockFetch);

    renderApp();

    // Вводим новый город и кликаем "Найти"
    await fireEvent.update(screen.getByTestId('city-input'), 'Москва');
    await fireEvent.click(screen.getByTestId('select-btn'));

    // Проверяем, что отображается выбранный город
    await screen.findByText(/Москва/i);

    // И хотя бы один из сегодняшних статов — "Влажность 77%"
    // (StatStub выводит label и stat как текст)
    await screen.findByText(/Влажность/i);
    await screen.findByText(/77%/);
  });

  it('Тест 2 (ошибка): неуспешный HTTP-ответ приводит к показу понятного сообщения', async () => {
    const mockFetch = vi.fn(async (arg) => {
      const urlStr = typeof arg === 'string' ? arg : arg.url;
      if (urlStr.includes(encodeURIComponent('Ошибоград'))) {
        // Симулируем неуспех
        return { ok: false, status: 404, statusText: 'Not Found' };
      }
      // Начальная загрузка — успешна
      return {
        ok: true,
        json: async () =>
          makeWeather({ humidity: 50, precip: 0, windspeed: 3.6, pressure: 1000 })
      };
    });

    vi.stubGlobal('fetch', mockFetch);

    renderApp();

    await fireEvent.update(screen.getByTestId('city-input'), 'Ошибоград');
    await fireEvent.click(screen.getByTestId('select-btn'));

    // Ваш код для !ok кидает "Ошибка сервера: 404. Попробуйте позже."
    // Проверим ключевую часть:
    const err = await screen.findByText(/Ошибка сервера: 404/i);
    expect(err).toBeInTheDocument();
  });

  it('Тест 3 (правильность запроса): endpoint и query-параметры корректны', async () => {
    const mockFetch = vi.fn(async (arg) => {
      // Для любых вызовов отдаём корректный ответ
      return {
        ok: true,
        json: async () =>
          makeWeather({ humidity: 60, precip: 0, windspeed: 3.6, pressure: 1000 })
      };
    });

    vi.stubGlobal('fetch', mockFetch);

    renderApp();

    // Выбираем город с пробелом, чтобы проверить encodeURIComponent и структуру пути
    await fireEvent.update(screen.getByTestId('city-input'), 'New York');
    await fireEvent.click(screen.getByTestId('select-btn'));

    // Дождёмся, чтобы запрос отработал
    await screen.findByText(/New York/i);

    // Берём последний вызов fetch (после авто-запроса на "Санкт-Петербург")
    const lastCallArg = mockFetch.mock.calls.at(-1)[0];
    const urlStr = typeof lastCallArg === 'string' ? lastCallArg : lastCallArg.url;
    const url = new URL(urlStr);

    // Проверяем хост, путь и параметры
    expect(url.hostname).toBe('weather.visualcrossing.com');
    // Путь должен включать timeline/New%20York/next4days
    expect(url.pathname).toMatch(/\/VisualCrossingWebServices\/rest\/services\/timeline\/New%20York\/next4days$/);

    // Query-параметры из вашего кода
    expect(url.searchParams.get('unitGroup')).toBe('metric');
    expect(url.searchParams.get('contentType')).toBe('json');
    // Ключ должен присутствовать и быть непустым
    expect(url.searchParams.get('key')).toBeTruthy();
  });
});
