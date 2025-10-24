import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface Note {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  tags: string[];
}

interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'climate' | 'security' | 'media';
  status: boolean;
  value?: number;
}

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [devices, setDevices] = useState<SmartDevice[]>([
    { id: '1', name: 'Гостиная', type: 'light', status: false, value: 80 },
    { id: '2', name: 'Спальня', type: 'light', status: false, value: 50 },
    { id: '3', name: 'Кондиционер', type: 'climate', status: false, value: 22 },
    { id: '4', name: 'Охрана', type: 'security', status: true, value: 100 },
  ]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState({ title: '', text: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [weatherData] = useState({ temp: 23, condition: 'Ясно', humidity: 65 });
  const [musicVolume, setMusicVolume] = useState([50]);
  const [systemStats, setSystemStats] = useState({ cpu: 45, ram: 62, disk: 78 });
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { toast } = useToast();

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('ru') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('anna') ||
       voice.name.toLowerCase().includes('elena') ||
       voice.name.toLowerCase().includes('irina') ||
       voice.name.toLowerCase().includes('milena'))
    );
    
    const russianVoice = femaleVoice || voices.find(voice => voice.lang.includes('ru'));
    
    if (russianVoice) {
      utterance.voice = russianVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            speak('Таймер завершён. Время истекло.');
            toast({
              title: "⏰ ТАЙМЕР ЗАВЕРШЁН",
              description: "Время истекло!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, toast, voiceEnabled]);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 40,
        ram: Math.floor(Math.random() * 20) + 50,
        disk: 78
      });
    }, 2000);
    return () => clearInterval(statsInterval);
  }, []);

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

  const processVoiceCommand = (command: string) => {
    if (command.includes('аномалия') || command.includes('активировать')) {
      if (!isActive) {
        setIsActive(true);
        speak('Система активирована. Все системы в рабочем состоянии.');
        toast({ title: '🎤 Голосовая команда', description: 'Система активирована' });
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
    
    if (command.includes('игр') || command.includes('gaming')) {
      setActiveWindow('gaming');
      speak('Активирую игровой режим');
      toast({ title: '🎤 Активирую игровой режим' });
    }
    
    if (command.includes('включи свет') || command.includes('свет')) {
      const lightDevice = devices.find(d => d.type === 'light');
      if (lightDevice) {
        toggleDevice(lightDevice.id);
        speak('Свет включён');
        toast({ title: '🎤 Свет включён' });
      }
    }
    
    if (command.includes('закрой') || command.includes('закрыть')) {
      setActiveWindow(null);
      speak('Окно закрыто');
      toast({ title: '🎤 Окно закрыто' });
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
    
    if (command.includes('время') || command.includes('который час')) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      speak(`Сейчас ${hours} часов ${minutes} минут`);
      toast({ title: '🎤 Время', description: `${hours}:${minutes.toString().padStart(2, '0')}` });
    }
    
    if (command.includes('статистика') || command.includes('система')) {
      speak(`Загрузка процессора ${systemStats.cpu} процентов, оперативной памяти ${systemStats.ram} процентов`);
      toast({ title: '🎤 Системная статистика', description: `CPU: ${systemStats.cpu}%, RAM: ${systemStats.ram}%` });
    }
  };

  const toggleVoiceListening = () => {
    const newState = !isListening;
    setIsListening(newState);
    if (newState) {
      speak('Голосовое управление активировано. Слушаю команды.');
    } else {
      speak('Голосовое управление деактивировано.');
    }
    toast({
      title: newState ? '🎤 ГОЛОСОВОЕ УПРАВЛЕНИЕ' : '🎤 Микрофон выключен',
      description: newState ? 'Слушаю команды...' : 'Голосовое управление деактивировано',
    });
  };

  const toggleVoiceResponses = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (newState) {
      speak('Голосовые ответы включены');
    }
    toast({
      title: newState ? '🔊 Голос включён' : '🔇 Голос выключен',
      description: newState ? 'Система будет отвечать голосом' : 'Только текстовые уведомления',
    });
  };

  const handleActivate = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "АНОМАЛИЯ ДЕАКТИВИРОВАНА" : "АНОМАЛИЯ АКТИВИРОВАНА",
      description: isActive ? "Система переведена в режим ожидания" : "Все системы онлайн. Готова к работе.",
    });
  };

  const addTask = (priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        priority,
        category: 'general'
      }]);
      setNewTask('');
      toast({
        title: "✅ Задача добавлена",
        description: newTask,
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addNote = () => {
    if (newNote.title.trim() && newNote.text.trim()) {
      setNotes([...notes, { 
        id: Date.now().toString(), 
        title: newNote.title,
        text: newNote.text, 
        timestamp: new Date().toLocaleString('ru-RU'),
        tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t)
      }]);
      setNewNote({ title: '', text: '', tags: '' });
      toast({
        title: "📝 Заметка сохранена",
        description: newNote.title,
      });
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: !device.status } : device
    ));
    const device = devices.find(d => d.id === id);
    if (device) {
      toast({
        title: device.status ? `${device.name} выключен` : `${device.name} включён`,
        description: `Статус устройства обновлён`,
      });
    }
  };

  const updateDeviceValue = (id: string, value: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, value } : device
    ));
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    toast({
      title: "⏱️ ТАЙМЕР ЗАПУЩЕН",
      description: `${minutes} минут на счётчике`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculate = () => {
    try {
      const result = eval(calcInput);
      setCalcResult(result.toString());
      toast({
        title: "🧮 Расчёт выполнен",
        description: `Результат: ${result}`,
      });
    } catch {
      setCalcResult('Ошибка');
      toast({
        title: "❌ Ошибка расчёта",
        description: "Проверьте корректность выражения",
      });
    }
  };

  const Window = ({ id, title, icon, children, width = 'w-[600px]' }: { 
    id: string; 
    title: string; 
    icon: string; 
    children: React.ReactNode;
    width?: string;
  }) => {
    if (activeWindow !== id) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <Card className={`${width} max-h-[80vh] overflow-auto bg-card/95 border-2 border-primary/60 neon-box`}>
          <div className="sticky top-0 z-10 bg-card/95 border-b border-primary/30 p-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Icon name={icon as any} size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-primary">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveWindow(null)}
              className="text-secondary hover:text-secondary hover:bg-secondary/10"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0E] via-[#1a1a2e] to-[#0A0A0E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="scan-line"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="border-b border-primary/20 bg-card/30 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-primary neon-box flex items-center justify-center animate-pulse">
                <Icon name="Cpu" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent tracking-wider">
                  АНОМАЛИЯ
                </h1>
                <p className="text-xs text-muted-foreground">Desktop OS v2.0</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Thermometer" size={16} className="text-secondary" />
                <span className="text-foreground">{weatherData.temp}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Clock" size={16} className="text-accent" />
                <span className="text-foreground">{new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <Button
                onClick={toggleVoiceResponses}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                title="Вкл/выкл голосовые ответы"
              >
                <Icon name={voiceEnabled ? "Volume2" : "VolumeX"} size={20} />
              </Button>
              <Button
                onClick={toggleVoiceListening}
                size="sm"
                className={`px-6 font-bold border-2 transition-all ${
                  isListening
                    ? 'bg-secondary text-black border-secondary shadow-[0_0_20px_rgba(255,0,110,0.6)] animate-pulse' 
                    : 'bg-transparent text-secondary border-secondary/50 hover:border-secondary'
                }`}
              >
                <Icon name="Mic" size={16} className="mr-2" />
                {isListening ? 'СЛУШАЮ' : 'ГОЛОС'}
              </Button>
              <Button
                onClick={handleActivate}
                size="sm"
                className={`px-6 font-bold border-2 transition-all ${
                  isActive 
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,240,0.6)]' 
                    : 'bg-transparent text-primary border-primary/50 hover:border-primary'
                }`}
              >
                {isActive ? (
                  <>
                    <Icon name="Zap" size={16} className="mr-2" />
                    АКТИВНА
                  </>
                ) : (
                  <>
                    <Icon name="Power" size={16} className="mr-2" />
                    АКТИВИРОВАТЬ
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {isActive && (
          <>
            <main className="flex-1 container mx-auto px-6 py-8">
              {isListening && voiceTranscript && (
                <div className="mb-6 animate-fade-in">
                  <Card className="bg-secondary/20 border-2 border-secondary/60 neon-box p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Mic" size={24} className="text-secondary pulse-glow" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Распознаю команду...</p>
                        <p className="text-lg text-foreground font-medium">{voiceTranscript}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              <div className="mb-8">
                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Глобальный поиск: файлы, команды, настройки..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-input border-2 border-primary/50 text-foreground text-lg py-6 pl-12 pr-4"
                    />
                    <Icon name="Search" size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">CPU</span>
                    <span className="text-primary font-bold">{systemStats.cpu}%</span>
                  </div>
                  <Progress value={systemStats.cpu} className="h-2" />
                </Card>

                <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">RAM</span>
                    <span className="text-secondary font-bold">{systemStats.ram}%</span>
                  </div>
                  <Progress value={systemStats.ram} className="h-2" />
                </Card>

                <Card className="bg-card/80 border-2 border-accent/40 neon-box p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">DISK</span>
                    <span className="text-accent font-bold">{systemStats.disk}%</span>
                  </div>
                  <Progress value={systemStats.disk} className="h-2" />
                </Card>

                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Задач</span>
                    <span className="text-primary font-bold">{tasks.filter(t => !t.completed).length}</span>
                  </div>
                  <Progress value={(tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100} className="h-2" />
                </Card>
              </div>

              <div className="grid grid-cols-5 gap-6">
                <Card 
                  onClick={() => setActiveWindow('tasks')}
                  className="bg-card/80 border-2 border-primary/40 neon-box p-8 hover:scale-105 hover:border-primary transition-all cursor-pointer"
                >
                  <Icon name="CheckSquare" size={56} className="text-primary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-primary text-center mb-2">Задачи</h3>
                  <p className="text-muted-foreground text-sm text-center">Управление делами</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('notes')}
                  className="bg-card/80 border-2 border-secondary/40 neon-box p-8 hover:scale-105 hover:border-secondary transition-all cursor-pointer"
                >
                  <Icon name="StickyNote" size={56} className="text-secondary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-secondary text-center mb-2">Заметки</h3>
                  <p className="text-muted-foreground text-sm text-center">Быстрые записи</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('timer')}
                  className="bg-card/80 border-2 border-accent/40 neon-box p-8 hover:scale-105 hover:border-accent transition-all cursor-pointer"
                >
                  <Icon name="Timer" size={56} className="text-accent mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-accent text-center mb-2">Таймеры</h3>
                  <p className="text-muted-foreground text-sm text-center">Отсчёт времени</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('smart-home')}
                  className="bg-card/80 border-2 border-primary/40 neon-box p-8 hover:scale-105 hover:border-primary transition-all cursor-pointer"
                >
                  <Icon name="Home" size={56} className="text-primary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-primary text-center mb-2">Умный Дом</h3>
                  <p className="text-muted-foreground text-sm text-center">Управление IoT</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('calculator')}
                  className="bg-card/80 border-2 border-secondary/40 neon-box p-8 hover:scale-105 hover:border-secondary transition-all cursor-pointer"
                >
                  <Icon name="Calculator" size={56} className="text-secondary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-secondary text-center mb-2">Калькулятор</h3>
                  <p className="text-muted-foreground text-sm text-center">Расчёты</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('weather')}
                  className="bg-card/80 border-2 border-accent/40 neon-box p-8 hover:scale-105 hover:border-accent transition-all cursor-pointer"
                >
                  <Icon name="Cloud" size={56} className="text-accent mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-accent text-center mb-2">Погода</h3>
                  <p className="text-muted-foreground text-sm text-center">Прогноз</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('news')}
                  className="bg-card/80 border-2 border-primary/40 neon-box p-8 hover:scale-105 hover:border-primary transition-all cursor-pointer"
                >
                  <Icon name="Newspaper" size={56} className="text-primary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-primary text-center mb-2">Новости</h3>
                  <p className="text-muted-foreground text-sm text-center">Актуальное</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('translate')}
                  className="bg-card/80 border-2 border-secondary/40 neon-box p-8 hover:scale-105 hover:border-secondary transition-all cursor-pointer"
                >
                  <Icon name="Languages" size={56} className="text-secondary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-secondary text-center mb-2">Переводы</h3>
                  <p className="text-muted-foreground text-sm text-center">Языки мира</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('music')}
                  className="bg-card/80 border-2 border-accent/40 neon-box p-8 hover:scale-105 hover:border-accent transition-all cursor-pointer"
                >
                  <Icon name="Music" size={56} className="text-accent mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-accent text-center mb-2">Музыка</h3>
                  <p className="text-muted-foreground text-sm text-center">Плеер</p>
                </Card>

                <Card 
                  onClick={() => setActiveWindow('gaming')}
                  className="bg-card/80 border-2 border-primary/40 neon-box p-8 hover:scale-105 hover:border-primary transition-all cursor-pointer"
                >
                  <Icon name="Gamepad2" size={56} className="text-primary mb-4 pulse-glow mx-auto" />
                  <h3 className="text-xl font-bold text-primary text-center mb-2">Gaming</h3>
                  <p className="text-muted-foreground text-sm text-center">Режим игры</p>
                </Card>
              </div>
            </main>

            <Window id="tasks" title="Управление Задачами" icon="CheckSquare" width="w-[700px]">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Новая задача..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="flex-1 bg-input border-2 border-primary/50 py-6"
                  />
                  <Button onClick={() => addTask('high')} className="bg-secondary text-black px-6">
                    <Icon name="AlertCircle" size={18} className="mr-2" />
                    Важная
                  </Button>
                  <Button onClick={() => addTask('medium')} className="bg-accent text-black px-6">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Обычная
                  </Button>
                </div>

                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ListTodo" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Нет активных задач</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`p-4 border-2 transition-all ${
                          task.completed
                            ? 'bg-muted/30 border-muted/50 opacity-60'
                            : task.priority === 'high'
                            ? 'bg-card/80 border-secondary/40 neon-box'
                            : 'bg-card/80 border-primary/40 neon-box'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                              task.completed
                                ? 'bg-primary border-primary'
                                : 'border-primary/50 hover:border-primary'
                            }`}
                          >
                            {task.completed && <Icon name="Check" size={16} className="text-black" />}
                          </button>
                          <p className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                            {task.text}
                          </p>
                          {task.priority === 'high' && !task.completed && (
                            <Badge className="bg-secondary text-black">Важно</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-secondary hover:text-secondary hover:bg-secondary/10"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </Window>

            <Window id="notes" title="Быстрые Заметки" icon="StickyNote" width="w-[800px]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Заголовок заметки..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="bg-input border-2 border-secondary/50 py-4"
                  />
                  <Textarea
                    placeholder="Содержание заметки..."
                    value={newNote.text}
                    onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                    className="bg-input border-2 border-secondary/50 min-h-[120px]"
                  />
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder="Теги (через запятую)..."
                      value={newNote.tags}
                      onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                      className="flex-1 bg-input border-2 border-secondary/50"
                    />
                    <Button onClick={addNote} className="bg-secondary text-black px-8">
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {notes.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Нет сохранённых заметок</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id} className="bg-card/80 border-2 border-secondary/40 neon-box p-6">
                        <h4 className="text-lg font-bold text-secondary mb-2">{note.title}</h4>
                        <p className="text-foreground mb-3 text-sm">{note.text}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {note.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-secondary/50 text-secondary">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </Window>

            <Window id="timer" title="Таймеры и Напоминания" icon="Timer">
              <div className="space-y-6">
                {timerSeconds > 0 && (
                  <div className="text-center">
                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary neon-glow mb-6">
                      {formatTime(timerSeconds)}
                    </div>
                    <Button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="bg-accent text-black px-8 py-4 font-bold"
                    >
                      <Icon name={isTimerRunning ? "Pause" : "Play"} size={20} className="mr-2" />
                      {isTimerRunning ? 'Пауза' : 'Продолжить'}
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  {[1, 5, 10, 15, 25, 30, 45, 60, 90].map((minutes) => (
                    <Button
                      key={minutes}
                      onClick={() => startTimer(minutes)}
                      className="bg-card border-2 border-accent/50 hover:border-accent hover:bg-accent/10 py-6 text-lg font-bold"
                    >
                      {minutes} мин
                    </Button>
                  ))}
                </div>
              </div>
            </Window>

            <Window id="smart-home" title="Управление Умным Домом" icon="Home" width="w-[700px]">
              <div className="space-y-4">
                {devices.map((device) => (
                  <Card key={device.id} className="bg-card/80 border-2 border-primary/40 neon-box p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Icon 
                          name={device.type === 'light' ? 'Lightbulb' : device.type === 'climate' ? 'Thermometer' : device.type === 'security' ? 'Shield' : 'Tv'} 
                          size={32} 
                          className={device.status ? 'text-primary' : 'text-muted-foreground'} 
                        />
                        <div>
                          <h4 className="text-lg font-bold text-foreground">{device.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {device.type === 'light' && 'Освещение'}
                            {device.type === 'climate' && 'Климат'}
                            {device.type === 'security' && 'Безопасность'}
                            {device.type === 'media' && 'Медиа'}
                          </p>
                        </div>
                      </div>
                      <Switch checked={device.status} onCheckedChange={() => toggleDevice(device.id)} />
                    </div>
                    {device.status && device.value !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {device.type === 'light' && 'Яркость'}
                            {device.type === 'climate' && 'Температура'}
                          </span>
                          <span className="text-primary font-bold">
                            {device.type === 'climate' ? `${device.value}°C` : `${device.value}%`}
                          </span>
                        </div>
                        <Slider
                          value={[device.value]}
                          onValueChange={(val) => updateDeviceValue(device.id, val[0])}
                          max={device.type === 'climate' ? 30 : 100}
                          min={device.type === 'climate' ? 16 : 0}
                          step={1}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Window>

            <Window id="calculator" title="Калькулятор" icon="Calculator">
              <div className="space-y-6">
                <Input
                  type="text"
                  placeholder="Введите выражение..."
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calculate()}
                  className="bg-input border-2 border-secondary/50 text-2xl py-6 text-center"
                />
                {calcResult && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Результат:</p>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">
                      {calcResult}
                    </p>
                  </div>
                )}
                <Button onClick={calculate} className="w-full bg-secondary text-black py-6 text-lg font-bold">
                  <Icon name="Equal" size={20} className="mr-2" />
                  Вычислить
                </Button>
              </div>
            </Window>

            <Window id="weather" title="Прогноз Погоды" icon="Cloud">
              <div className="text-center space-y-6">
                <div className="text-8xl mb-4">☀️</div>
                <div>
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary neon-glow mb-2">
                    {weatherData.temp}°C
                  </p>
                  <p className="text-2xl text-foreground font-medium mb-1">{weatherData.condition}</p>
                  <p className="text-muted-foreground">Влажность: {weatherData.humidity}%</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="bg-card/80 border border-accent/30 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Завтра</p>
                    <p className="text-3xl mb-1">🌤️</p>
                    <p className="text-xl font-bold text-accent">25°C</p>
                  </Card>
                  <Card className="bg-card/80 border border-accent/30 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Понедельник</p>
                    <p className="text-3xl mb-1">⛅</p>
                    <p className="text-xl font-bold text-accent">22°C</p>
                  </Card>
                  <Card className="bg-card/80 border border-accent/30 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Вторник</p>
                    <p className="text-3xl mb-1">🌧️</p>
                    <p className="text-xl font-bold text-accent">18°C</p>
                  </Card>
                </div>
              </div>
            </Window>

            <Window id="news" title="Актуальные Новости" icon="Newspaper" width="w-[800px]">
              <div className="space-y-4">
                {['Новые технологии в сфере ИИ', 'Прорыв в квантовых вычислениях', 'Запуск новой космической миссии'].map((title, i) => (
                  <Card key={i} className="bg-card/80 border-2 border-primary/40 neon-box p-6 cursor-pointer hover:scale-105 transition-transform">
                    <h4 className="text-lg font-bold text-primary mb-2">{title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('ru-RU')}</p>
                  </Card>
                ))}
              </div>
            </Window>

            <Window id="translate" title="Переводчик" icon="Languages">
              <div className="space-y-4">
                <Textarea
                  placeholder="Введите текст для перевода..."
                  className="bg-input border-2 border-secondary/50 min-h-[120px]"
                />
                <div className="flex gap-4">
                  <Button className="flex-1 bg-secondary text-black">RU → EN</Button>
                  <Button className="flex-1 bg-accent text-black">EN → RU</Button>
                </div>
                <Card className="bg-muted border border-primary/30 p-6">
                  <p className="text-foreground">Перевод появится здесь...</p>
                </Card>
              </div>
            </Window>

            <Window id="music" title="Музыкальный Плеер" icon="Music">
              <div className="space-y-6">
                <Card className="bg-card/80 border-2 border-accent/40 p-8 text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-2xl font-bold text-accent mb-2">Neon Dreams</h3>
                  <p className="text-muted-foreground mb-6">Synthwave Collection</p>
                  <div className="flex justify-center gap-4 mb-6">
                    <Button variant="ghost" size="lg">
                      <Icon name="SkipBack" size={24} />
                    </Button>
                    <Button size="lg" className="bg-accent text-black w-16 h-16 rounded-full">
                      <Icon name="Play" size={28} />
                    </Button>
                    <Button variant="ghost" size="lg">
                      <Icon name="SkipForward" size={24} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>2:34</span>
                      <span>4:12</span>
                    </div>
                    <Slider value={[60]} max={100} />
                  </div>
                </Card>
                <div className="flex items-center gap-4">
                  <Icon name="Volume2" size={20} className="text-accent" />
                  <Slider value={musicVolume} onValueChange={setMusicVolume} max={100} />
                  <span className="text-sm text-foreground w-12">{musicVolume[0]}%</span>
                </div>
              </div>
            </Window>

            <Window id="gaming" title="Игровой Режим" icon="Gamepad2">
              <div className="space-y-6">
                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6 text-center">
                  <Icon name="Gamepad2" size={64} className="text-primary mx-auto mb-4 pulse-glow" />
                  <h3 className="text-2xl font-bold text-primary mb-4">Режим активирован</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Оптимизация производительности</span>
                      <Badge className="bg-primary text-black">ВКЛ</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Отключение уведомлений</span>
                      <Badge className="bg-primary text-black">ВКЛ</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Boost FPS</span>
                      <Badge className="bg-primary text-black">ВКЛ</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </Window>
          </>
        )}

        <footer className="border-t border-primary/20 bg-card/30 backdrop-blur-md py-4">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ANOMALY DESKTOP OS v2.0 • {isActive ? 'SYSTEM STATUS: ' : ''} 
              <span className={isActive ? "text-primary font-bold" : "text-muted-foreground"}>
                {isActive ? 'ONLINE' : 'STANDBY'}
              </span>
            </p>
            {timerSeconds > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Timer" size={16} className="text-accent" />
                <span className="text-accent font-bold">{formatTime(timerSeconds)}</span>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;