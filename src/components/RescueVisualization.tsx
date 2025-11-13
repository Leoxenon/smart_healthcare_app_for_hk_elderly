import { MapPin, Ambulance, Users, Clock, Phone, CheckCircle, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';
import { speakText } from '../utils/audioManager';

interface RescueVisualizationProps {
  onClose: () => void;
}

interface RescueTeam {
  id: number;
  type: 'ambulance' | 'social-worker' | 'family';
  name: string;
  distance: number;
  eta: number;
  status: 'dispatched' | 'on-route' | 'arrived';
  phone: string;
  icon: string;
}

export function RescueVisualization({ onClose }: RescueVisualizationProps) {
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([
    {
      id: 1,
      type: 'ambulance',
      name: '救護車 A112',
      distance: 2.5,
      eta: 5,
      status: 'on-route',
      phone: '999',
      icon: '🚑',
    },
    {
      id: 2,
      type: 'social-worker',
      name: '社工 - 黃姑娘',
      distance: 1.2,
      eta: 3,
      status: 'on-route',
      phone: '8403-0622',
      icon: '👩‍⚕️',
    },
    {
      id: 3,
      type: 'family',
      name: '李女士（女兒）',
      distance: 5.0,
      eta: 12,
      status: 'dispatched',
      phone: '9876-5432',
      icon: '👩',
    },
  ]);

  const [mapCenter, setMapCenter] = useState({ lat: 22.3193, lng: 114.1694 }); // Hong Kong
  const [userLocation] = useState({ lat: 22.3193, lng: 114.1694 });
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Update ETA countdown
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      
      setRescueTeams((teams) =>
        teams.map((team) => {
          if (team.eta > 0) {
            const newEta = Math.max(0, team.eta - 0.017); // Decrease by ~1 second
            const newStatus = newEta <= 0.5 ? 'arrived' : team.status;
            return { ...team, eta: newEta, status: newStatus };
          }
          return team;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Voice announcement using global audio manager
    speakText('緊急救援已啟動。救護車預計5分鐘內到達，社工預計3分鐘內到達。請保持冷靜，留在原地等待。', {
      lang: 'zh-HK',
      rate: 0.9,
      volume: 1.0,
    });
  }, []);

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '即將到達';
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}分${secs}秒`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-500';
      case 'on-route':
        return 'bg-blue-500';
      case 'dispatched':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'arrived':
        return '已到達';
      case 'on-route':
        return '正在前往';
      case 'dispatched':
        return '已調度';
      default:
        return '準備中';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      {/* Header */}
      <div className="bg-red-600 p-6 shadow-2xl">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-3 animate-pulse">
              <Ambulance className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h1 className="text-white">緊急救援進行中</h1>
              <p className="text-red-100">已通知救護車及緊急聯繫人</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mock Map */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-red-500 relative" style={{ height: '500px' }}>
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>

              {/* User Location (Center) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" style={{ width: '60px', height: '60px' }}></div>
                  <div className="relative bg-red-600 rounded-full p-4 shadow-2xl">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                      您嘅位置
                    </span>
                  </div>
                </div>
              </div>

              {/* Ambulance Icon */}
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative animate-bounce">
                  <div className="bg-blue-600 rounded-full p-4 shadow-2xl">
                    <span style={{ fontSize: '32px' }}>🚑</span>
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      救護車 2.5km
                    </span>
                  </div>
                  {/* Animated route line */}
                  <svg className="absolute top-1/2 left-1/2" style={{ width: '200px', height: '200px', overflow: 'visible' }}>
                    <line
                      x1="0"
                      y1="0"
                      x2="150"
                      y2="100"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="10 5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              {/* Social Worker Icon */}
              <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative animate-bounce" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-green-600 rounded-full p-4 shadow-2xl">
                    <span style={{ fontSize: '32px' }}>👩‍⚕️</span>
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      社工 1.2km
                    </span>
                  </div>
                </div>
              </div>

              {/* Family Member Icon */}
              <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 z-10">
                <div className="relative">
                  <div className="bg-yellow-600 rounded-full p-4 shadow-2xl">
                    <span style={{ fontSize: '32px' }}>👩</span>
                  </div>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                      家人 5.0km
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 rounded-2xl p-4">
                <p className="text-white mb-2">圖例</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="text-white">您嘅位置</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-500" />
                    <span className="text-white">救援路線</span>
                  </div>
                </div>
              </div>

              {/* Night Mode Toggle Info */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-80 rounded-2xl p-3">
                <p className="text-white">高對比度模式</p>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-gray-800 mb-6">救援進度</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 rounded-full p-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">接收緊急求助</p>
                    <p className="text-green-600">已完成</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-500 rounded-full p-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">通知緊急聯繫人</p>
                    <p className="text-green-600">已完成</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 rounded-full p-3 animate-pulse">
                    <Ambulance className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">救護車前往中</p>
                    <div className="bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(10, 100 - (rescueTeams[0].eta / 5) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-blue-600 mt-1">預計 {formatTime(rescueTeams[0].eta)} 到達</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">家人前往中</p>
                    <p className="text-yellow-600">預計 {formatTime(rescueTeams[2].eta)} 到達</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rescue Teams Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h2 className="text-gray-800 mb-6">救援隊伍</h2>
              
              <div className="space-y-4">
                {rescueTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`rounded-2xl p-6 border-2 ${
                      team.status === 'arrived'
                        ? 'bg-green-50 border-green-300'
                        : team.status === 'on-route'
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{team.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 mb-2">{team.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`${getStatusColor(team.status)} text-white px-3 py-1 rounded-full`}>
                            {getStatusText(team.status)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            距離: {team.distance} km
                          </p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {team.status === 'arrived' ? '已到達' : `預計: ${formatTime(team.eta)}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${team.phone}`}
                      className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl px-6 py-4 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-3"
                    >
                      <Phone className="w-6 h-6" />
                      <span>致電 {team.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Instructions */}
            <div className="bg-red-50 rounded-3xl shadow-2xl p-6 border-2 border-red-300">
              <h3 className="text-red-700 mb-4">緊急指引</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</span>
                  <span className="text-gray-700">保持冷靜，留在原地</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</span>
                  <span className="text-gray-700">確保門口暢通無阻</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</span>
                  <span className="text-gray-700">如有需要，致電999</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</span>
                  <span className="text-gray-700">準備好身份證同健康卡</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg"
            >
              關閉（救援繼續進行）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
