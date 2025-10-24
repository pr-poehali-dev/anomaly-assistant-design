import { useEffect } from 'react';
import { Task, SmartDevice, WeatherData, SystemStats } from './types';

interface UseVoiceProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  setVoiceTranscript: (value: string) => void;
  voiceEnabled: boolean;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  setActiveWindow: (value: string | null) => void;
  weatherData: WeatherData;
  systemStats: SystemStats;
  devices: SmartDevice[];
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  toggleDevice: (id: string) => void;
  speak: (text: string) => void;
  toast: any;
}

export const useVoice = ({
  isListening,
  setIsListening,
  setVoiceTranscript,
  voiceEnabled,
  isActive,
  setIsActive,
  setActiveWindow,
  weatherData,
  systemStats,
  devices,
  tasks,
  setTasks,
  toggleDevice,
  speak,
  toast,
}: UseVoiceProps) => {
  const processVoiceCommand = (command: string) => {
    if (command.includes('аномалия') || command.includes('активировать')) {
      if (!isActive) {
        setIsActive(true);
        speak('Система активирована. Все системы в рабочем состоянии.');
        toast({ title: '🎤 Голосовая команда', description: 'Система активирована' });
      }
    }

    if (command.includes('деактивир') || command.includes('выключ')) {
      if (isActive) {
        setIsActive(false);
        speak('Система деактивирована');
        toast({ title: '🎤 Система выключена' });
      }
    }
    
    if (command.includes('задач') || command.includes('задачи')) {
      setActiveWindow('tasks');
      speak('Открываю менеджер задач');
      toast({ title: '🎤 Открываю задачи' });
    }
    
    if (command.includes('заметк')) {
      setActiveWindow('notes');
      speak('Открываю заметки');
      toast({ title: '🎤 Открываю заметки' });
    }
    
    if (command.includes('таймер')) {
      setActiveWindow('timer');
      speak('Запускаю таймер');
      toast({ title: '🎤 Открываю таймер' });
    }

    if (command.includes('календар')) {
      setActiveWindow('calendar');
      speak('Открываю календарь');
      toast({ title: '🎤 Открываю календарь' });
    }
    
    if (command.includes('умный дом') || command.includes('дом')) {
      setActiveWindow('smart-home');
      speak('Активирую панель управления умным домом');
      toast({ title: '🎤 Открываю умный дом' });
    }
    
    if (command.includes('калькулятор') || command.includes('посчитай')) {
      setActiveWindow('calculator');
      speak('Открываю калькулятор');
      toast({ title: '🎤 Открываю калькулятор' });
    }
    
    if (command.includes('погод')) {
      setActiveWindow('weather');
      speak(`Погода: ${weatherData.temp} градусов, ${weatherData.condition.toLowerCase()}`);
      toast({ title: '🎤 Открываю погоду' });
    }
    
    if (command.includes('новост')) {
      setActiveWindow('news');
      speak('Загружаю последние новости');
      toast({ title: '🎤 Открываю новости' });
    }
    
    if (command.includes('перевод') || command.includes('переведи')) {
      setActiveWindow('translate');
      speak('Запускаю переводчик');
      toast({ title: '🎤 Открываю переводчик' });
    }
    
    if (command.includes('музык')) {
      setActiveWindow('music');
      speak('Открываю музыкальный плеер');
      toast({ title: '🎤 Открываю музыку' });
    }

    if (command.includes('файл')) {
      setActiveWindow('files');
      speak('Открываю файловый менеджер');
      toast({ title: '🎤 Открываю файлы' });
    }

    if (command.includes('чат') || command.includes('сообщени')) {
      setActiveWindow('chat');
      speak('Открываю чат');
      toast({ title: '🎤 Открываю чат' });
    }

    if (command.includes('почт') || command.includes('email')) {
      setActiveWindow('email');
      speak('Открываю почту');
      toast({ title: '🎤 Открываю почту' });
    }

    if (command.includes('карт')) {
      setActiveWindow('maps');
      speak('Открываю карты');
      toast({ title: '🎤 Открываю карты' });
    }

    if (command.includes('настройк')) {
      setActiveWindow('settings');
      speak('Открываю настройки');
      toast({ title: '🎤 Открываю настройки' });
    }

    if (command.includes('камер')) {
      setActiveWindow('camera');
      speak('Активирую камеру');
      toast({ title: '🎤 Активирую камеру' });
    }

    if (command.includes('терминал') || command.includes('консол')) {
      setActiveWindow('terminal');
      speak('Открываю терминал');
      toast({ title: '🎤 Открываю терминал' });
    }

    if (command.includes('редактор') || command.includes('код')) {
      setActiveWindow('code');
      speak('Запускаю редактор кода');
      toast({ title: '🎤 Запускаю редактор' });
    }

    if (command.includes('здоров')) {
      setActiveWindow('health');
      speak('Открываю мониторинг здоровья');
      toast({ title: '🎤 Открываю здоровье' });
    }
    
    if (command.includes('игр') || command.includes('gaming')) {
      setActiveWindow('gaming');
      speak('Активирую игровой режим');
      toast({ title: '🎤 Активирую игровой режим' });
    }
    
    if (command.includes('включи свет') || command.includes('свет вкл')) {
      const lightDevice = devices.find(d => d.type === 'light' && !d.status);
      if (lightDevice) {
        toggleDevice(lightDevice.id);
        speak('Свет включён');
        toast({ title: '🎤 Свет включён' });
      }
    }

    if (command.includes('выключи свет') || command.includes('свет выкл')) {
      const lightDevice = devices.find(d => d.type === 'light' && d.status);
      if (lightDevice) {
        toggleDevice(lightDevice.id);
        speak('Свет выключён');
        toast({ title: '🎤 Свет выключен' });
      }
    }

    if (command.includes('включи все')) {
      devices.forEach(d => {
        if (!d.status) toggleDevice(d.id);
      });
      speak('Все устройства включены');
      toast({ title: '🎤 Все устройства включены' });
    }

    if (command.includes('выключи все')) {
      devices.forEach(d => {
        if (d.status) toggleDevice(d.id);
      });
      speak('Все устройства выключены');
      toast({ title: '🎤 Все устройства выключены' });
    }

    if (command.includes('температур')) {
      speak(`Температура ${weatherData.temp} градусов`);
      toast({ title: '🎤 Температура', description: `${weatherData.temp}°C` });
    }
    
    if (command.includes('закрой') || command.includes('закрыть')) {
      setActiveWindow(null);
      speak('Окно закрыто');
      toast({ title: '🎤 Окно закрыто' });
    }

    if (command.includes('закрой все')) {
      setActiveWindow(null);
      speak('Все окна закрыты');
      toast({ title: '🎤 Все окна закрыты' });
    }
    
    if (command.includes('добавь задачу')) {
      const taskText = command.replace(/добавь задачу/gi, '').trim();
      if (taskText) {
        setTasks([...tasks, { 
          id: Date.now().toString(), 
          text: taskText, 
          completed: false,
          priority: 'medium',
          category: 'general'
        }]);
        speak(`Задача добавлена: ${taskText}`);
        toast({ title: '🎤 Задача добавлена', description: taskText });
      }
    }

    if (command.includes('сколько задач')) {
      const activeCount = tasks.filter(t => !t.completed).length;
      speak(`У вас ${activeCount} активных задач`);
      toast({ title: '🎤 Задачи', description: `${activeCount} активных` });
    }

    if (command.includes('удали все задачи')) {
      setTasks([]);
      speak('Все задачи удалены');
      toast({ title: '🎤 Все задачи удалены' });
    }
    
    if (command.includes('время') || command.includes('который час')) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      speak(`Сейчас ${hours} часов ${minutes} минут`);
      toast({ title: '🎤 Время', description: `${hours}:${minutes.toString().padStart(2, '0')}` });
    }

    if (command.includes('дата') || command.includes('какое число')) {
      const now = new Date();
      const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      speak(`Сегодня ${date}`);
      toast({ title: '🎤 Дата', description: date });
    }

    if (command.includes('день недели')) {
      const now = new Date();
      const day = now.toLocaleDateString('ru-RU', { weekday: 'long' });
      speak(`Сегодня ${day}`);
      toast({ title: '🎤 День недели', description: day });
    }
    
    if (command.includes('статистика') || command.includes('система')) {
      speak(`Загрузка процессора ${systemStats.cpu} процентов, оперативной памяти ${systemStats.ram} процентов`);
      toast({ title: '🎤 Системная статистика', description: `CPU: ${systemStats.cpu}%, RAM: ${systemStats.ram}%` });
    }

    if (command.includes('помощь') || command.includes('справка') || command.includes('что ты умеешь')) {
      speak('Я могу открывать приложения, управлять задачами и устройствами, показывать время и погоду. Скажите открыть приложение или добавить задачу');
      toast({ title: '🎤 Справка', description: 'Доступны команды: открыть, добавить, включить, выключить, время, погода' });
    }

    if (command.includes('перезагрузк')) {
      speak('Перезагружаю систему');
      toast({ title: '🎤 Перезагрузка системы' });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (command.includes('очисти экран')) {
      setActiveWindow(null);
      speak('Экран очищен');
      toast({ title: '🎤 Экран очищен' });
    }
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setVoiceTranscript(transcript);
      
      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(transcript.toLowerCase());
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);
};
