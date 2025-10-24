import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Task, Note, SmartDevice } from '@/components/anomaly/types';
import { useVoice } from '@/components/anomaly/useVoice';
import { AnomalyHeader } from '@/components/anomaly/AnomalyHeader';
import { SystemStats } from '@/components/anomaly/SystemStats';
import { AppGrid } from '@/components/anomaly/AppGrid';
import { WindowContainer } from '@/components/anomaly/WindowContainer';

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

  useVoice({
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
  });

  const handleActivate = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "АНОМАЛИЯ ДЕАКТИВИРОВАНА" : "АНОМАЛИЯ АКТИВИРОВАНА",
      description: isActive ? "Система переведена в режим ожидания" : "Все системы онлайн. Готова к работе.",
    });
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
    toast({
      title: "🗑️ Задача удалена",
    });
  };

  const addNote = () => {
    if (newNote.title.trim() || newNote.text.trim()) {
      setNotes([...notes, {
        id: Date.now().toString(),
        title: newNote.title,
        text: newNote.text,
        timestamp: new Date().toLocaleString('ru-RU'),
        tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t)
      }]);
      setNewNote({ title: '', text: '', tags: '' });
      toast({
        title: "📝 Заметка создана",
      });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "🗑️ Заметка удалена",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0E] via-[#1a1a2e] to-[#0A0A0E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="scan-line"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <AnomalyHeader
          weatherData={weatherData}
          voiceEnabled={voiceEnabled}
          isListening={isListening}
          isActive={isActive}
          toggleVoiceResponses={toggleVoiceResponses}
          toggleVoiceListening={toggleVoiceListening}
          handleActivate={handleActivate}
        />

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

              <SystemStats systemStats={systemStats} tasks={tasks} />
              <AppGrid setActiveWindow={setActiveWindow} />
            </main>
          </>
        )}
      </div>

      <WindowContainer
        id="tasks"
        title="МЕНЕДЖЕР ЗАДАЧ"
        icon="ListTodo"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Новая задача..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1 bg-input border-primary/50"
            />
            <Button onClick={() => addTask()} className="bg-primary text-black hover:bg-primary/90">
              <Icon name="Plus" size={20} />
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card/50 border-primary/30">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.text}
                  </span>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="notes"
        title="ЗАМЕТКИ"
        icon="StickyNote"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Заголовок..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="bg-input border-secondary/50"
            />
            <Textarea
              placeholder="Текст заметки..."
              value={newNote.text}
              onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
              className="bg-input border-secondary/50 min-h-[100px]"
            />
            <Input
              type="text"
              placeholder="Теги (через запятую)..."
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              className="bg-input border-secondary/50"
            />
            <Button onClick={addNote} className="w-full bg-secondary text-black hover:bg-secondary/90">
              <Icon name="Plus" size={20} className="mr-2" />
              Создать заметку
            </Button>
          </div>
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id} className="p-4 bg-card/50 border-secondary/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-secondary">{note.title || 'Без заголовка'}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                <p className="text-sm text-foreground mb-2">{note.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {note.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{note.timestamp}</p>
              </Card>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="timer"
        title="ТАЙМЕР"
        icon="Timer"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[400px]"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-accent mb-4">
              {formatTime(timerSeconds)}
            </div>
            {isTimerRunning && (
              <Button
                onClick={() => setIsTimerRunning(false)}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <Icon name="Pause" size={20} className="mr-2" />
                Пауза
              </Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 5, 10, 15, 25, 30, 45, 60, 90].map(min => (
              <Button
                key={min}
                onClick={() => startTimer(min)}
                className="bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30"
              >
                {min} мин
              </Button>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="smart-home"
        title="УМНЫЙ ДОМ"
        icon="Home"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-4">
          {devices.map((device) => (
            <Card key={device.id} className="p-4 bg-card/50 border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon 
                    name={device.type === 'light' ? 'Lightbulb' : device.type === 'climate' ? 'Wind' : device.type === 'security' ? 'ShieldCheck' : 'Tv'} 
                    size={24} 
                    className="text-primary" 
                  />
                  <span className="font-bold text-foreground">{device.name}</span>
                </div>
                <Switch
                  checked={device.status}
                  onCheckedChange={() => toggleDevice(device.id)}
                />
              </div>
              {device.status && device.value !== undefined && (
                <Slider
                  value={[device.value]}
                  onValueChange={(val) => updateDeviceValue(device.id, val[0])}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              )}
            </Card>
          ))}
        </div>
      </WindowContainer>

      <WindowContainer
        id="calculator"
        title="КАЛЬКУЛЯТОР"
        icon="Calculator"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[400px]"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Введите выражение..."
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculate()}
            className="bg-input border-secondary/50 text-lg"
          />
          {calcResult && (
            <div className="text-3xl font-bold text-secondary text-center p-4 bg-secondary/10 rounded-lg">
              = {calcResult}
            </div>
          )}
          <Button onClick={calculate} className="w-full bg-secondary text-black hover:bg-secondary/90">
            <Icon name="Calculator" size={20} className="mr-2" />
            Вычислить
          </Button>
        </div>
      </WindowContainer>

      <WindowContainer
        id="weather"
        title="ПОГОДА"
        icon="CloudSun"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[500px]"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-8xl font-bold text-accent mb-2">{weatherData.temp}°C</div>
            <p className="text-2xl text-foreground">{weatherData.condition}</p>
          </div>
          <Card className="p-4 bg-card/50 border-accent/30">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Влажность</span>
              <span className="font-bold text-accent">{weatherData.humidity}%</span>
            </div>
          </Card>
        </div>
      </WindowContainer>

      <WindowContainer
        id="news"
        title="НОВОСТИ"
        icon="Newspaper"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[700px]"
      >
        <div className="space-y-4">
          <Card className="p-4 bg-card/50 border-primary/30">
            <h3 className="font-bold text-primary mb-2">Последние события</h3>
            <p className="text-sm text-muted-foreground">Новостная лента в разработке...</p>
          </Card>
        </div>
      </WindowContainer>

      <WindowContainer
        id="translate"
        title="ПЕРЕВОДЧИК"
        icon="Languages"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-4">
          <Textarea
            placeholder="Введите текст для перевода..."
            className="bg-input border-secondary/50 min-h-[100px]"
          />
          <Button className="w-full bg-secondary text-black hover:bg-secondary/90">
            <Icon name="Languages" size={20} className="mr-2" />
            Перевести
          </Button>
        </div>
      </WindowContainer>

      <WindowContainer
        id="music"
        title="МУЗЫКАЛЬНЫЙ ПЛЕЕР"
        icon="Music"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-6">
          <div className="text-center">
            <Icon name="Music" size={64} className="text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Плейлист пуст</p>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="Volume2" size={20} className="text-accent" />
            <Slider
              value={musicVolume}
              onValueChange={setMusicVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-accent font-bold w-12">{musicVolume}%</span>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="calendar"
        title="КАЛЕНДАРЬ"
        icon="Calendar"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[700px]"
      >
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-secondary mb-2">
              {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-muted-foreground">{new Date().toLocaleDateString('ru-RU', { weekday: 'long' })}</p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="text-center font-bold text-secondary p-2">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <Card key={i} className="p-3 bg-card/50 border-primary/20 hover:border-primary/50 cursor-pointer transition-all text-center">
                <span className="text-foreground">{(i % 28) + 1}</span>
              </Card>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="files"
        title="ФАЙЛОВЫЙ МЕНЕДЖЕР"
        icon="FolderOpen"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[800px]"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30">
              <Icon name="FolderPlus" size={20} className="mr-2" />
              Новая папка
            </Button>
            <Button className="bg-secondary/20 border border-secondary/50 text-secondary hover:bg-secondary/30">
              <Icon name="Upload" size={20} className="mr-2" />
              Загрузить
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {['Документы', 'Изображения', 'Видео', 'Музыка', 'Загрузки', 'Проекты'].map(folder => (
              <Card key={folder} className="p-4 bg-card/50 border-primary/30 hover:border-primary cursor-pointer transition-all">
                <Icon name="Folder" size={48} className="text-primary mx-auto mb-2" />
                <p className="text-center text-sm text-foreground">{folder}</p>
              </Card>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="chat"
        title="ЧАТ"
        icon="MessageSquare"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[600px]"
      >
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto space-y-3 p-4 bg-card/30 rounded-lg">
            <Card className="p-3 bg-primary/10 border-primary/30 max-w-[80%]">
              <p className="text-sm text-foreground">Привет! Как дела?</p>
              <p className="text-xs text-muted-foreground mt-1">10:30</p>
            </Card>
            <Card className="p-3 bg-secondary/10 border-secondary/30 max-w-[80%] ml-auto">
              <p className="text-sm text-foreground">Отлично! Работаю над проектом 🚀</p>
              <p className="text-xs text-muted-foreground mt-1">10:32</p>
            </Card>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              className="flex-1 bg-input border-accent/50"
            />
            <Button className="bg-accent text-black hover:bg-accent/90">
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="email"
        title="ПОЧТА"
        icon="Mail"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[900px]"
      >
        <div className="space-y-4">
          <Button className="bg-primary text-black hover:bg-primary/90">
            <Icon name="Plus" size={20} className="mr-2" />
            Написать письмо
          </Button>
          <div className="space-y-2">
            {['Важное письмо от команды', 'Еженедельный отчет', 'Приглашение на встречу'].map((subject, i) => (
              <Card key={i} className="p-4 bg-card/50 border-primary/30 hover:border-primary cursor-pointer transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{subject}</h4>
                    <p className="text-sm text-muted-foreground">support@anomaly.dev</p>
                  </div>
                  <Badge variant="secondary">Новое</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="maps"
        title="КАРТЫ"
        icon="Map"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[900px]"
      >
        <div className="space-y-4">
          <Input
            placeholder="Поиск на карте..."
            className="bg-input border-secondary/50"
          />
          <div className="h-[500px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/30 flex items-center justify-center">
            <Icon name="MapPin" size={80} className="text-primary opacity-30" />
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="settings"
        title="НАСТРОЙКИ"
        icon="Settings"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[700px]"
      >
        <div className="space-y-6">
          {[
            { icon: 'User', title: 'Профиль', desc: 'Управление аккаунтом' },
            { icon: 'Palette', title: 'Оформление', desc: 'Темы и цвета' },
            { icon: 'Bell', title: 'Уведомления', desc: 'Настройки оповещений' },
            { icon: 'Shield', title: 'Безопасность', desc: 'Пароли и доступ' },
            { icon: 'Wifi', title: 'Сеть', desc: 'Подключения и VPN' },
            { icon: 'HardDrive', title: 'Хранилище', desc: 'Управление данными' },
          ].map((item, i) => (
            <Card key={i} className="p-4 bg-card/50 border-accent/30 hover:border-accent cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                <Icon name={item.icon as any} size={32} className="text-accent" />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </WindowContainer>

      <WindowContainer
        id="camera"
        title="КАМЕРА"
        icon="Camera"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[800px]"
      >
        <div className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg border-2 border-primary/30 flex items-center justify-center">
            <Icon name="Camera" size={100} className="text-primary opacity-30" />
          </div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-primary text-black hover:bg-primary/90">
              <Icon name="Camera" size={20} className="mr-2" />
              Сделать фото
            </Button>
            <Button className="bg-secondary text-black hover:bg-secondary/90">
              <Icon name="Video" size={20} className="mr-2" />
              Запись видео
            </Button>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="terminal"
        title="ТЕРМИНАЛ"
        icon="Terminal"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[900px]"
      >
        <div className="space-y-4">
          <div className="bg-black/90 p-4 rounded-lg font-mono text-sm min-h-[400px]">
            <p className="text-primary">$ ANOMALY OS v2.0</p>
            <p className="text-secondary">$ System ready...</p>
            <p className="text-accent">$ Awaiting commands...</p>
            <p className="text-foreground mt-4">$ <span className="animate-pulse">_</span></p>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="code"
        title="РЕДАКТОР КОДА"
        icon="Code"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[1000px]"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 text-xs">
              index.tsx
            </Button>
            <Button className="bg-secondary/20 border border-secondary/50 text-secondary hover:bg-secondary/30 text-xs">
              styles.css
            </Button>
          </div>
          <div className="bg-black/90 p-4 rounded-lg font-mono text-sm min-h-[500px]">
            <p className="text-secondary">{'// ANOMALY Code Editor'}</p>
            <p className="text-accent">{'import { useState } from "react";'}</p>
            <p className="text-primary">{'function App() {'}</p>
            <p className="text-foreground ml-4">{'return <div>Hello World</div>;'}</p>
            <p className="text-primary">{'}'}</p>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="health"
        title="МОНИТОРИНГ ЗДОРОВЬЯ"
        icon="Heart"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        width="w-[700px]"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-card/50 border-primary/30 text-center">
              <Icon name="Heart" size={48} className="text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary">72</p>
              <p className="text-sm text-muted-foreground">BPM</p>
            </Card>
            <Card className="p-6 bg-card/50 border-secondary/30 text-center">
              <Icon name="Footprints" size={48} className="text-secondary mx-auto mb-3" />
              <p className="text-3xl font-bold text-secondary">8,542</p>
              <p className="text-sm text-muted-foreground">Шагов</p>
            </Card>
            <Card className="p-6 bg-card/50 border-accent/30 text-center">
              <Icon name="Flame" size={48} className="text-accent mx-auto mb-3" />
              <p className="text-3xl font-bold text-accent">420</p>
              <p className="text-sm text-muted-foreground">Калорий</p>
            </Card>
            <Card className="p-6 bg-card/50 border-primary/30 text-center">
              <Icon name="Moon" size={48} className="text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary">7.5</p>
              <p className="text-sm text-muted-foreground">Часов сна</p>
            </Card>
          </div>
        </div>
      </WindowContainer>

      <WindowContainer
        id="gaming"
        title="ИГРОВОЙ РЕЖИМ"
        icon="Gamepad2"
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      >
        <div className="space-y-6 text-center">
          <Icon name="Gamepad2" size={80} className="text-primary mx-auto pulse-glow" />
          <h3 className="text-2xl font-bold text-primary">РЕЖИМ АКТИВИРОВАН</h3>
          <p className="text-muted-foreground">Оптимизация производительности...</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="p-4 bg-card/50 border-primary/30">
              <p className="text-sm text-muted-foreground">FPS</p>
              <p className="text-3xl font-bold text-primary">144</p>
            </Card>
            <Card className="p-4 bg-card/50 border-secondary/30">
              <p className="text-sm text-muted-foreground">Ping</p>
              <p className="text-3xl font-bold text-secondary">12ms</p>
            </Card>
          </div>
        </div>
      </WindowContainer>
    </div>
  );
};

export default Index;