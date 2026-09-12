/** Multilingual UI strings for the interactive timer app. */
import type { Mode } from './types';
import type { Lang } from '../i18n/ui';

export interface AppStrings {
	appName: string;
	start: string;
	pause: string;
	resume: string;
	reset: string;
	restart: string;
	stopwatch: string;
	lap: string;
	addMinute: string;
	subMinute: string;
	finished: string;
	ready: string;
	overtime: string;
	skip: string;
	fullscreen: string;
	share: string;
	settings: string;
	help: string;
	mute: string;
	unmute: string;
	close: string;
	copied: string;
	copyLink: string;
	qrCode: string;
	qrHint: string;
	newTimer: string;
	timerLabel: (n: number) => string;
	timeShort: string;
	phaseLabel: string;
	roundOf: (r: number, total: number) => string;
	stepOf: (i: number, total: number) => string;
	configButton: string;
	presetButton: string;
	keyboardHint: string;
	keepScreen: string;
	notifications: string;
	vibration: string;
	soundTest: string;
	chooseSound: string;
	displayStyle: string;
	themeSetting: string;
	overtimeSetting: string;
	autoRestart: string;
	autoAdvance: string;
	volume: string;
	popular: string;
	useCases: string;
	recent: string;
	customPresets: string;
	addPreset: string;
	presetName: string;
	live: string;
	liveCreate: string;
	liveEnd: string;
	liveConnecting: string;
	liveReconnecting: string;
	liveRoleHost: string;
	liveRoleViewer: string;
	liveHostBadge: string;
	liveViewerBadge: string;
	liveShareHint: string;
	liveLinkLabel: string;
	liveParticipants: (n: number) => string;
	liveLost: string;
	liveLostHint: string;
	liveReload: string;
	aria: {
		doneSuffix: string;
		secondsUnit: (n: number) => string;
		minuteUnit: (n: number) => string;
		remaining: string;
		conjunction: string;
	};
}

const pt: AppStrings = {
	appName: 'Temporizador Online',
	start: 'Iniciar',
	pause: 'Pausar',
	resume: 'Retomar',
	reset: 'Redefinir',
	restart: 'Recomeçar',
	stopwatch: 'Cronômetro',
	lap: 'Volta',
	addMinute: 'Adicionar 1 minuto',
	subMinute: 'Subtrair 1 minuto',
	finished: 'Concluído',
	ready: 'Pronto',
	overtime: 'Tempo extra',
	skip: 'Pular',
	fullscreen: 'Tela cheia',
	share: 'Compartilhar',
	settings: 'Configurações',
	help: 'Ajuda e atalhos',
	mute: 'Silenciar',
	unmute: 'Ativar som',
	close: 'Fechar',
	copied: 'Link copiado!',
	copyLink: 'Copiar link',
	qrCode: 'Código QR',
	qrHint: 'Abra no celular com a câmera',
	newTimer: 'Novo timer',
	timerLabel: (n: number) => `Timer ${n}`,
	timeShort: 'Tempo',
	phaseLabel: 'Fase',
	roundOf: (r: number, total: number) => `Rodada ${r} de ${total}`,
	stepOf: (i: number, total: number) => `Etapa ${i} de ${total}`,
	configButton: 'Configurar',
	presetButton: 'Presets',
	keyboardHint: 'Espaço inicia/pausa · R redefine · F tela cheia · M som · ? ajuda',
	keepScreen: 'Manter tela ligada',
	notifications: 'Notificações do navegador',
	vibration: 'Vibração no celular',
	soundTest: 'Testar som',
	chooseSound: 'Som do alarme',
	displayStyle: 'Estilo do mostrador',
	themeSetting: 'Tema',
	overtimeSetting: 'Continuar contando após zero',
	autoRestart: 'Recomeçar sozinho',
	autoAdvance: 'Avançar fases automaticamente',
	volume: 'Volume',
	popular: 'Temporizadores populares',
	useCases: 'Temporizadores para cada tarefa',
	recent: 'Usados recentemente',
	customPresets: 'Meus presets',
	addPreset: 'Salvar este tempo',
	presetName: 'Nome do preset',
	live: 'Ao vivo',
	liveCreate: 'Criar sala ao vivo',
	liveEnd: 'Encerrar sala',
	liveConnecting: 'Conectando…',
	liveReconnecting: 'Reconectando…',
	liveRoleHost: 'Você é o anfitrião e controla o timer.',
	liveRoleViewer: 'O anfitrião controla o timer.',
	liveHostBadge: 'Anfitrião',
	liveViewerBadge: 'Participante',
	liveShareHint: 'Quem abrir o link entra na sala e vê o timer em tempo real.',
	liveLinkLabel: 'Link da sala',
	liveParticipants: (n) => (n === 1 ? '1 conectado' : `${n} conectados`),
	liveLost: 'O timer foi perdido',
	liveLostHint: 'O anfitrião saiu ou a conexão caiu. Atualize a página para recomeçar.',
	liveReload: 'Atualizar página',
	aria: {
		doneSuffix: 'concluído. Tempo esgotado.',
		secondsUnit: (n: number) => (n === 1 ? '1 segundo' : `${n} segundos`),
		minuteUnit: (n: number) => (n === 1 ? '1 minuto' : `${n} minutos`),
		remaining: 'restantes',
		conjunction: ' e ',
	},
};

const en: AppStrings = {
	appName: 'Online Timer',
	start: 'Start',
	pause: 'Pause',
	resume: 'Resume',
	reset: 'Reset',
	restart: 'Restart',
	stopwatch: 'Stopwatch',
	lap: 'Lap',
	addMinute: 'Add 1 minute',
	subMinute: 'Subtract 1 minute',
	finished: 'Finished',
	ready: 'Ready',
	overtime: 'Overtime',
	skip: 'Skip',
	fullscreen: 'Fullscreen',
	share: 'Share',
	settings: 'Settings',
	help: 'Help & shortcuts',
	mute: 'Mute',
	unmute: 'Unmute',
	close: 'Close',
	copied: 'Link copied!',
	copyLink: 'Copy link',
	qrCode: 'QR code',
	qrHint: 'Open on your phone with the camera',
	newTimer: 'New timer',
	timerLabel: (n: number) => `Timer ${n}`,
	timeShort: 'Time',
	phaseLabel: 'Phase',
	roundOf: (r: number, total: number) => `Round ${r} of ${total}`,
	stepOf: (i: number, total: number) => `Step ${i} of ${total}`,
	configButton: 'Configure',
	presetButton: 'Presets',
	keyboardHint: 'Space start/pause · R reset · F fullscreen · M sound · ? help',
	keepScreen: 'Keep screen on',
	notifications: 'Browser notifications',
	vibration: 'Phone vibration',
	soundTest: 'Test sound',
	chooseSound: 'Alarm sound',
	displayStyle: 'Display style',
	themeSetting: 'Theme',
	overtimeSetting: 'Keep counting after zero',
	autoRestart: 'Restart automatically',
	autoAdvance: 'Advance phases automatically',
	volume: 'Volume',
	popular: 'Popular timers',
	useCases: 'Timers for every task',
	recent: 'Recently used',
	customPresets: 'My presets',
	addPreset: 'Save this time',
	presetName: 'Preset name',
	live: 'Live',
	liveCreate: 'Create a live room',
	liveEnd: 'End room',
	liveConnecting: 'Connecting…',
	liveReconnecting: 'Reconnecting…',
	liveRoleHost: 'You are the host and control the timer.',
	liveRoleViewer: 'The host controls the timer.',
	liveHostBadge: 'Host',
	liveViewerBadge: 'Guest',
	liveShareHint: 'Anyone who opens the link joins the room and sees the timer in real time.',
	liveLinkLabel: 'Room link',
	liveParticipants: (n) => (n === 1 ? '1 connected' : `${n} connected`),
	liveLost: 'The timer was lost',
	liveLostHint: 'The host left or the connection dropped. Refresh the page to restart.',
	liveReload: 'Refresh page',
	aria: {
		doneSuffix: 'finished. Time is up.',
		secondsUnit: (n: number) => (n === 1 ? '1 second' : `${n} seconds`),
		minuteUnit: (n: number) => (n === 1 ? '1 minute' : `${n} minutes`),
		remaining: 'remaining',
		conjunction: ' and ',
	},
};

const es: AppStrings = {
	appName: 'Temporizador Online',
	start: 'Iniciar',
	pause: 'Pausar',
	resume: 'Reanudar',
	reset: 'Reiniciar',
	restart: 'Empezar de nuevo',
	stopwatch: 'Cronómetro',
	lap: 'Vuelta',
	addMinute: 'Añadir 1 minuto',
	subMinute: 'Restar 1 minuto',
	finished: 'Finalizado',
	ready: 'Listo',
	overtime: 'Tiempo extra',
	skip: 'Saltar',
	fullscreen: 'Pantalla completa',
	share: 'Compartir',
	settings: 'Configuración',
	help: 'Ayuda y atajos',
	mute: 'Silenciar',
	unmute: 'Activar sonido',
	close: 'Cerrar',
	copied: '¡Enlace copiado!',
	copyLink: 'Copiar enlace',
	qrCode: 'Código QR',
	qrHint: 'Abre en el móvil con la cámara',
	newTimer: 'Nuevo temporizador',
	timerLabel: (n: number) => `Temporizador ${n}`,
	timeShort: 'Tiempo',
	phaseLabel: 'Fase',
	roundOf: (r: number, total: number) => `Ronda ${r} de ${total}`,
	stepOf: (i: number, total: number) => `Paso ${i} de ${total}`,
	configButton: 'Configurar',
	presetButton: 'Presets',
	keyboardHint: 'Espacio inicia/pausa · R reinicia · F pantalla completa · M sonido · ? ayuda',
	keepScreen: 'Mantener pantalla encendida',
	notifications: 'Notificaciones del navegador',
	vibration: 'Vibración en el móvil',
	soundTest: 'Probar sonido',
	chooseSound: 'Sonido de la alarma',
	displayStyle: 'Estilo del reloj',
	themeSetting: 'Tema',
	overtimeSetting: 'Seguir contando después del cero',
	autoRestart: 'Reiniciar solo',
	autoAdvance: 'Avanzar fases automáticamente',
	volume: 'Volumen',
	popular: 'Temporizadores populares',
	useCases: 'Temporizadores para cada tarea',
	recent: 'Usados recientemente',
	customPresets: 'Mis presets',
	addPreset: 'Guardar este tiempo',
	presetName: 'Nombre del preset',
	live: 'En vivo',
	liveCreate: 'Crear sala en vivo',
	liveEnd: 'Cerrar sala',
	liveConnecting: 'Conectando…',
	liveReconnecting: 'Reconectando…',
	liveRoleHost: 'Tú eres el anfitrión y controlas el temporizador.',
	liveRoleViewer: 'El anfitrión controla el temporizador.',
	liveHostBadge: 'Anfitrión',
	liveViewerBadge: 'Participante',
	liveShareHint: 'Quien abra el enlace entrará en la sala y verá el temporizador en tiempo real.',
	liveLinkLabel: 'Enlace de la sala',
	liveParticipants: (n) => (n === 1 ? '1 conectado' : `${n} conectados`),
	liveLost: 'El temporizador se perdió',
	liveLostHint: 'El anfitrión salió o la conexión cayó. Actualiza la página para reiniciar.',
	liveReload: 'Actualizar página',
	aria: {
		doneSuffix: 'finalizado. Se acabó el tiempo.',
		secondsUnit: (n: number) => (n === 1 ? '1 segundo' : `${n} segundos`),
		minuteUnit: (n: number) => (n === 1 ? '1 minuto' : `${n} minutos`),
		remaining: 'restantes',
		conjunction: ' y ',
	},
};

const ja: AppStrings = {
	appName: 'オンラインタイマー',
	start: '開始',
	pause: '一時停止',
	resume: '再開',
	reset: 'リセット',
	restart: 'やり直す',
	stopwatch: 'ストップウォッチ',
	lap: 'ラップ',
	addMinute: '1分追加',
	subMinute: '1分減らす',
	finished: '終了',
	ready: '準備完了',
	overtime: '延長',
	skip: 'スキップ',
	fullscreen: '全画面',
	share: '共有',
	settings: '設定',
	help: 'ヘルプとショートカット',
	mute: 'ミュート',
	unmute: '音を出す',
	close: '閉じる',
	copied: 'リンクをコピーしました！',
	copyLink: 'リンクをコピー',
	qrCode: 'QRコード',
	qrHint: 'スマホのカメラで開く',
	newTimer: '新しいタイマー',
	timerLabel: (n: number) => `タイマー ${n}`,
	timeShort: '時間',
	phaseLabel: 'フェーズ',
	roundOf: (r: number, total: number) => `ラウンド ${r} / ${total}`,
	stepOf: (i: number, total: number) => `ステップ ${i} / ${total}`,
	configButton: '設定',
	presetButton: 'プリセット',
	keyboardHint: 'スペースで開始/一時停止 · R リセット · F 全画面 · M 音 · ? ヘルプ',
	keepScreen: '画面を点灯し続ける',
	notifications: 'ブラウザ通知',
	vibration: 'スマホのバイブレーション',
	soundTest: '音をテスト',
	chooseSound: 'アラーム音',
	displayStyle: '表示スタイル',
	themeSetting: 'テーマ',
	overtimeSetting: 'ゼロの後も計測を続ける',
	autoRestart: '自動で再開',
	autoAdvance: 'フェーズを自動で進める',
	volume: '音量',
	popular: '人気のタイマー',
	useCases: '用途に合わせたタイマー',
	recent: '最近使ったもの',
	customPresets: 'マイプリセット',
	addPreset: 'この時間を保存',
	presetName: 'プリセット名',
	live: 'ライブ',
	liveCreate: 'ライブルームを作成',
	liveEnd: 'ルームを終了',
	liveConnecting: '接続中…',
	liveReconnecting: '再接続中…',
	liveRoleHost: 'あなたがホストです。タイマーを操作できます。',
	liveRoleViewer: 'ホストがタイマーを操作します。',
	liveHostBadge: 'ホスト',
	liveViewerBadge: '参加者',
	liveShareHint: 'リンクを開いた人はルームに入り、タイマーがリアルタイムで表示されます。',
	liveLinkLabel: 'ルームのリンク',
	liveParticipants: (n) => `${n}人接続中`,
	liveLost: 'タイマーが失われました',
	liveLostHint: 'ホストが退出したか、接続が切れました。ページを更新して再開してください。',
	liveReload: 'ページを更新',
	aria: {
		doneSuffix: '終了しました。時間切れです。',
		secondsUnit: (n: number) => `${n}秒`,
		minuteUnit: (n: number) => `${n}分`,
		remaining: '残り',
		conjunction: '',
	},
};

const fr: AppStrings = {
	appName: 'Minuteur en ligne',
	start: 'Démarrer',
	pause: 'Pause',
	resume: 'Reprendre',
	reset: 'Réinitialiser',
	restart: 'Recommencer',
	stopwatch: 'Chronomètre',
	lap: 'Tour',
	addMinute: 'Ajouter 1 minute',
	subMinute: 'Retirer 1 minute',
	finished: 'Terminé',
	ready: 'Prêt',
	overtime: 'Temps supplémentaire',
	skip: 'Passer',
	fullscreen: 'Plein écran',
	share: 'Partager',
	settings: 'Paramètres',
	help: 'Aide et raccourcis',
	mute: 'Couper le son',
	unmute: 'Activer le son',
	close: 'Fermer',
	copied: 'Lien copié !',
	copyLink: 'Copier le lien',
	qrCode: 'QR code',
	qrHint: 'Ouvrir sur le téléphone avec la caméra',
	newTimer: 'Nouveau minuteur',
	timerLabel: (n: number) => `Minuteur ${n}`,
	timeShort: 'Temps',
	phaseLabel: 'Phase',
	roundOf: (r: number, total: number) => `Série ${r} sur ${total}`,
	stepOf: (i: number, total: number) => `Étape ${i} sur ${total}`,
	configButton: 'Configurer',
	presetButton: 'Préréglages',
	keyboardHint: 'Espace démarrer/pause · R réinitialiser · F plein écran · M son · ? aide',
	keepScreen: 'Garder l’écran allumé',
	notifications: 'Notifications du navigateur',
	vibration: 'Vibration du téléphone',
	soundTest: 'Tester le son',
	chooseSound: 'Son de l’alarme',
	displayStyle: 'Style du cadran',
	themeSetting: 'Thème',
	overtimeSetting: 'Continuer à compter après zéro',
	autoRestart: 'Recommencer automatiquement',
	autoAdvance: 'Avancer les phases automatiquement',
	volume: 'Volume',
	popular: 'Minuteurs populaires',
	useCases: 'Minuteurs pour chaque tâche',
	recent: 'Récemment utilisés',
	customPresets: 'Mes préréglages',
	addPreset: 'Enregistrer ce temps',
	presetName: 'Nom du préréglage',
	live: 'En direct',
	liveCreate: 'Créer une salle en direct',
	liveEnd: 'Fermer la salle',
	liveConnecting: 'Connexion…',
	liveReconnecting: 'Reconnexion…',
	liveRoleHost: 'Vous êtes l’hôte et contrôlez le minuteur.',
	liveRoleViewer: 'L’hôte contrôle le minuteur.',
	liveHostBadge: 'Hôte',
	liveViewerBadge: 'Participant',
	liveShareHint: 'Quiconque ouvre le lien rejoint la salle et voit le minuteur en temps réel.',
	liveLinkLabel: 'Lien de la salle',
	liveParticipants: (n) => (n <= 1 ? '1 connecté' : `${n} connectés`),
	liveLost: 'Le minuteur est perdu',
	liveLostHint: "L'hôte est parti ou la connexion a été perdue. Actualisez la page pour recommencer.",
	liveReload: 'Actualiser la page',
	aria: {
		doneSuffix: 'terminé. Le temps est écoulé.',
		secondsUnit: (n: number) => (n <= 1 ? '1 seconde' : `${n} secondes`),
		minuteUnit: (n: number) => (n <= 1 ? '1 minute' : `${n} minutes`),
		remaining: 'restantes',
		conjunction: ' et ',
	},
};

const de: AppStrings = {
	appName: 'Online-Timer',
	start: 'Start',
	pause: 'Pause',
	resume: 'Fortsetzen',
	reset: 'Zurücksetzen',
	restart: 'Neu starten',
	stopwatch: 'Stoppuhr',
	lap: 'Runde',
	addMinute: '1 Minute hinzufügen',
	subMinute: '1 Minute abziehen',
	finished: 'Beendet',
	ready: 'Bereit',
	overtime: 'Überzeit',
	skip: 'Überspringen',
	fullscreen: 'Vollbild',
	share: 'Teilen',
	settings: 'Einstellungen',
	help: 'Hilfe & Tastenkürzel',
	mute: 'Stumm',
	unmute: 'Ton einschalten',
	close: 'Schließen',
	copied: 'Link kopiert!',
	copyLink: 'Link kopieren',
	qrCode: 'QR-Code',
	qrHint: 'Mit der Kamera am Handy öffnen',
	newTimer: 'Neuer Timer',
	timerLabel: (n: number) => `Timer ${n}`,
	timeShort: 'Zeit',
	phaseLabel: 'Phase',
	roundOf: (r: number, total: number) => `Runde ${r} von ${total}`,
	stepOf: (i: number, total: number) => `Schritt ${i} von ${total}`,
	configButton: 'Konfigurieren',
	presetButton: 'Voreinstellungen',
	keyboardHint: 'Leertaste Start/Pause · R zurücksetzen · F Vollbild · M Ton · ? Hilfe',
	keepScreen: 'Bildschirm an lassen',
	notifications: 'Browser-Benachrichtigungen',
	vibration: 'Vibration am Handy',
	soundTest: 'Ton testen',
	chooseSound: 'Alarmton',
	displayStyle: 'Anzeigestil',
	themeSetting: 'Design',
	overtimeSetting: 'Nach null weiterzählen',
	autoRestart: 'Automatisch neu starten',
	autoAdvance: 'Phasen automatisch wechseln',
	volume: 'Lautstärke',
	popular: 'Beliebte Timer',
	useCases: 'Timer für jede Aufgabe',
	recent: 'Zuletzt verwendet',
	customPresets: 'Meine Voreinstellungen',
	addPreset: 'Diese Zeit speichern',
	presetName: 'Name der Voreinstellung',
	live: 'Live',
	liveCreate: 'Live-Raum erstellen',
	liveEnd: 'Raum beenden',
	liveConnecting: 'Verbinden…',
	liveReconnecting: 'Wiederverbinden…',
	liveRoleHost: 'Du bist der Gastgeber und steuerst den Timer.',
	liveRoleViewer: 'Der Gastgeber steuert den Timer.',
	liveHostBadge: 'Gastgeber',
	liveViewerBadge: 'Teilnehmer',
	liveShareHint: 'Wer den Link öffnet, tritt dem Raum bei und sieht den Timer in Echtzeit.',
	liveLinkLabel: 'Raumlink',
	liveParticipants: (n) => (n === 1 ? '1 verbunden' : `${n} verbunden`),
	liveLost: 'Der Timer ist verloren',
	liveLostHint: 'Der Gastgeber hat die Seite verlassen oder die Verbindung ist abgebrochen. Aktualisieren Sie die Seite, um neu zu starten.',
	liveReload: 'Seite aktualisieren',
	aria: {
		doneSuffix: 'beendet. Die Zeit ist um.',
		secondsUnit: (n: number) => (n === 1 ? '1 Sekunde' : `${n} Sekunden`),
		minuteUnit: (n: number) => (n === 1 ? '1 Minute' : `${n} Minuten`),
		remaining: 'Übrig',
		conjunction: ' und ',
	},
};

const ko: AppStrings = {
	appName: '온라인 타이머',
	start: '시작',
	pause: '일시정지',
	resume: '재개',
	reset: '초기화',
	restart: '다시 시작',
	stopwatch: '스톱워치',
	lap: '랩',
	addMinute: '1분 추가',
	subMinute: '1분 빼기',
	finished: '완료',
	ready: '준비',
	overtime: '추가 시간',
	skip: '건너뛰기',
	fullscreen: '전체 화면',
	share: '공유',
	settings: '설정',
	help: '도움말 및 단축키',
	mute: '음소거',
	unmute: '소리 켜기',
	close: '닫기',
	copied: '링크를 복사했습니다!',
	copyLink: '링크 복사',
	qrCode: 'QR 코드',
	qrHint: '휴대폰 카메라로 열기',
	newTimer: '새 타이머',
	timerLabel: (n: number) => `타이머 ${n}`,
	timeShort: '시간',
	phaseLabel: '단계',
	roundOf: (r: number, total: number) => `라운드 ${r}/${total}`,
	stepOf: (i: number, total: number) => `스텝 ${i}/${total}`,
	configButton: '구성',
	presetButton: '프리셋',
	keyboardHint: '스페이스 시작/일시정지 · R 초기화 · F 전체 화면 · M 소리 · ? 도움말',
	keepScreen: '화면 켜짐 유지',
	notifications: '브라우저 알림',
	vibration: '휴대폰 진동',
	soundTest: '소리 테스트',
	chooseSound: '알람 소리',
	displayStyle: '디스플레이 스타일',
	themeSetting: '테마',
	overtimeSetting: '0 이후에도 계속 측정',
	autoRestart: '자동으로 다시 시작',
	autoAdvance: '단계 자동 진행',
	volume: '볼륨',
	popular: '인기 타이머',
	useCases: '작업별 타이머',
	recent: '최근 사용',
	customPresets: '내 프리셋',
	addPreset: '이 시간 저장',
	presetName: '프리셋 이름',
	live: '실시간',
	liveCreate: '실시간 방 만들기',
	liveEnd: '방 종료',
	liveConnecting: '연결 중…',
	liveReconnecting: '재연결 중…',
	liveRoleHost: '당신이 호스트이며 타이머를 제어합니다.',
	liveRoleViewer: '호스트가 타이머를 제어합니다.',
	liveHostBadge: '호스트',
	liveViewerBadge: '참여자',
	liveShareHint: '링크를 연 사람은 방에 들어와 실시간으로 타이머를 봅니다.',
	liveLinkLabel: '방 링크',
	liveParticipants: (n) => `${n}명 연결됨`,
	liveLost: '타이머가 유실되었습니다',
	liveLostHint: '호스트가 나가거나 연결이 끊겼습니다. 페이지를 새로 고쳐 다시 시작하세요.',
	liveReload: '페이지 새로 고침',
	aria: {
		doneSuffix: '완료되었습니다. 시간이 끝났습니다.',
		secondsUnit: (n: number) => `${n}초`,
		minuteUnit: (n: number) => `${n}분`,
		remaining: '남음',
		conjunction: '',
	},
};

const it: AppStrings = {
	appName: 'Timer Online',
	start: 'Avvia',
	pause: 'Pausa',
	resume: 'Riprendi',
	reset: 'Azzera',
	restart: 'Ricomincia',
	stopwatch: 'Cronometro',
	lap: 'Giro',
	addMinute: 'Aggiungi 1 minuto',
	subMinute: 'Togli 1 minuto',
	finished: 'Finito',
	ready: 'Pronto',
	overtime: 'Tempo extra',
	skip: 'Salta',
	fullscreen: 'Schermo intero',
	share: 'Condividi',
	settings: 'Impostazioni',
	help: 'Aiuto e scorciatoie',
	mute: 'Silenzia',
	unmute: 'Attiva suono',
	close: 'Chiudi',
	copied: 'Link copiato!',
	copyLink: 'Copia link',
	qrCode: 'Codice QR',
	qrHint: 'Apri sul telefono con la fotocamera',
	newTimer: 'Nuovo timer',
	timerLabel: (n: number) => `Timer ${n}`,
	timeShort: 'Tempo',
	phaseLabel: 'Fase',
	roundOf: (r: number, total: number) => `Round ${r} di ${total}`,
	stepOf: (i: number, total: number) => `Passo ${i} di ${total}`,
	configButton: 'Configura',
	presetButton: 'Preset',
	keyboardHint: 'Spazio avvia/pausa · R azzera · F schermo intero · M suono · ? aiuto',
	keepScreen: 'Mantieni schermo acceso',
	notifications: 'Notifiche del browser',
	vibration: 'Vibrazione sul telefono',
	soundTest: 'Prova suono',
	chooseSound: 'Suono della sveglia',
	displayStyle: 'Stile del quadrante',
	themeSetting: 'Tema',
	overtimeSetting: 'Continua a contare dopo lo zero',
	autoRestart: 'Ricomincia automaticamente',
	autoAdvance: 'Cambia fase automaticamente',
	volume: 'Volume',
	popular: 'Timer popolari',
	useCases: 'Timer per ogni compito',
	recent: 'Usati di recente',
	customPresets: 'I miei preset',
	addPreset: 'Salva questo tempo',
	presetName: 'Nome del preset',
	live: 'In diretta',
	liveCreate: 'Crea una stanza in diretta',
	liveEnd: 'Chiudi stanza',
	liveConnecting: 'Connessione…',
	liveReconnecting: 'Riconnessione…',
	liveRoleHost: 'Sei l’ospite e controlli il timer.',
	liveRoleViewer: 'L’ospite controlla il timer.',
	liveHostBadge: 'Ospite',
	liveViewerBadge: 'Partecipante',
	liveShareHint: 'Chi apre il link entra nella stanza e vede il timer in tempo reale.',
	liveLinkLabel: 'Link della stanza',
	liveParticipants: (n) => (n === 1 ? '1 collegato' : `${n} collegati`),
	liveLost: 'Il timer è andato perso',
	liveLostHint: "L'host ha lasciato o la connessione è caduta. Aggiorna la pagina per ricominciare.",
	liveReload: 'Aggiorna pagina',
	aria: {
		doneSuffix: 'finito. Il tempo è scaduto.',
		secondsUnit: (n: number) => (n === 1 ? '1 secondo' : `${n} secondi`),
		minuteUnit: (n: number) => (n === 1 ? '1 minuto' : `${n} minuti`),
		remaining: 'rimanenti',
		conjunction: ' e ',
	},
};

const dicts: Record<Lang, AppStrings> = { pt, en, es, ja, fr, de, ko, it };

export type StringsKey = keyof AppStrings;

export const MODE_NAMES: Record<Mode, string> = {
	timer: 'Temporizador',
	stopwatch: 'Cronômetro',
	pomodoro: 'Pomodoro',
	interval: 'Intervalos',
	meditation: 'Meditação',
	sequence: 'Sequências',
};

export const SOUND_NAMES: Record<string, string> = {
	beep: 'Bipe',
	digital: 'Digital',
	chime: 'Sineta',
	zen: 'Zen',
	bell: 'Campainha',
};

export const DISPLAY_NAMES: Record<string, string> = {
	digital: 'Digital',
	circular: 'Progresso circular',
	bar: 'Barra de progresso',
	minimal: 'Mínimo',
};

export const THEME_NAMES: Record<string, string> = {
	light: 'Claro',
	dark: 'Escuro',
	system: 'Sistema',
};

export const PHASE_NAMES: Record<string, string> = {
	prepare: 'Prepare-se',
	work: 'Trabalho',
	rest: 'Descanso',
	focus: 'Foco',
	shortBreak: 'Pausa curta',
	longBreak: 'Pausa longa',
	step: 'Etapa',
	overtime: 'Tempo extra',
	elapsed: 'Tempo',
	countdown: 'Temporizador',
};

const modesPt = MODE_NAMES;
const modesAll: Record<Lang, Record<Mode, string>> = {
	pt: modesPt,
	en: { timer: 'Timer', stopwatch: 'Stopwatch', pomodoro: 'Pomodoro', interval: 'Intervals', meditation: 'Meditation', sequence: 'Sequences' },
	es: { timer: 'Temporizador', stopwatch: 'Cronómetro', pomodoro: 'Pomodoro', interval: 'Intervalos', meditation: 'Meditación', sequence: 'Secuencias' },
	ja: { timer: 'タイマー', stopwatch: 'ストップウォッチ', pomodoro: 'ポモドーロ', interval: 'インターバル', meditation: '瞑想', sequence: 'シーケンス' },
	fr: { timer: 'Minuteur', stopwatch: 'Chronomètre', pomodoro: 'Pomodoro', interval: 'Intervalles', meditation: 'Méditation', sequence: 'Séquences' },
	de: { timer: 'Timer', stopwatch: 'Stoppuhr', pomodoro: 'Pomodoro', interval: 'Intervalle', meditation: 'Meditation', sequence: 'Sequenzen' },
	ko: { timer: '타이머', stopwatch: '스톱워치', pomodoro: '포모도로', interval: '인터벌', meditation: '명상', sequence: '시퀀스' },
	it: { timer: 'Timer', stopwatch: 'Cronometro', pomodoro: 'Pomodoro', interval: 'Intervalli', meditation: 'Meditazione', sequence: 'Sequenze' },
};

const soundsAll: Record<Lang, Record<string, string>> = {
	pt: SOUND_NAMES,
	en: { beep: 'Beep', digital: 'Digital', chime: 'Chime', zen: 'Zen', bell: 'Bell' },
	es: { beep: 'Pitido', digital: 'Digital', chime: 'Campana', zen: 'Zen', bell: 'Timbre' },
	ja: { beep: 'ビープ', digital: 'デジタル', chime: 'チャイム', zen: '禅', bell: 'ベル' },
	fr: { beep: 'Bip', digital: 'Numérique', chime: 'Carillon', zen: 'Zen', bell: 'Cloche' },
	de: { beep: 'Piepton', digital: 'Digital', chime: 'Glockenspiel', zen: 'Zen', bell: 'Klingel' },
	ko: { beep: '비프음', digital: '디지털', chime: '차임', zen: '젠', bell: '벨' },
	it: { beep: 'Bip', digital: 'Digitale', chime: 'Carillon', zen: 'Zen', bell: 'Campanella' },
};

const displaysAll: Record<Lang, Record<string, string>> = {
	pt: DISPLAY_NAMES,
	en: { digital: 'Digital', circular: 'Circular progress', bar: 'Progress bar', minimal: 'Minimal' },
	es: { digital: 'Digital', circular: 'Progreso circular', bar: 'Barra de progreso', minimal: 'Mínimo' },
	ja: { digital: 'デジタル', circular: '円形プログレス', bar: 'プログレスバー', minimal: 'ミニマル' },
	fr: { digital: 'Numérique', circular: 'Progression circulaire', bar: 'Barre de progression', minimal: 'Minimal' },
	de: { digital: 'Digital', circular: 'Kreisfortschritt', bar: 'Fortschrittsbalken', minimal: 'Minimal' },
	ko: { digital: '디지털', circular: '원형 진행', bar: '진행 막대', minimal: '미니멀' },
	it: { digital: 'Digitale', circular: 'Avanzamento circolare', bar: 'Barra di avanzamento', minimal: 'Minimale' },
};

const themesAll: Record<Lang, Record<string, string>> = {
	pt: THEME_NAMES,
	en: { light: 'Light', dark: 'Dark', system: 'System' },
	es: { light: 'Claro', dark: 'Oscuro', system: 'Sistema' },
	ja: { light: 'ライト', dark: 'ダーク', system: 'システム' },
	fr: { light: 'Clair', dark: 'Sombre', system: 'Système' },
	de: { light: 'Hell', dark: 'Dunkel', system: 'System' },
	ko: { light: '라이트', dark: '다크', system: '시스템' },
	it: { light: 'Chiaro', dark: 'Scuro', system: 'Sistema' },
};

const phasesAll: Record<Lang, Record<string, string>> = {
	pt: PHASE_NAMES,
	en: {
		prepare: 'Get ready',
		work: 'Work',
		rest: 'Rest',
		focus: 'Focus',
		shortBreak: 'Short break',
		longBreak: 'Long break',
		step: 'Step',
		overtime: 'Overtime',
		elapsed: 'Time',
		countdown: 'Timer',
	},
	es: {
		prepare: 'Prepárate',
		work: 'Trabajo',
		rest: 'Descanso',
		focus: 'Enfoque',
		shortBreak: 'Pausa corta',
		longBreak: 'Pausa larga',
		step: 'Paso',
		overtime: 'Tiempo extra',
		elapsed: 'Tiempo',
		countdown: 'Temporizador',
	},
	ja: {
		prepare: '準備',
		work: '作業',
		rest: '休憩',
		focus: '集中',
		shortBreak: '短い休憩',
		longBreak: '長い休憩',
		step: 'ステップ',
		overtime: '延長',
		elapsed: '経過',
		countdown: 'カウントダウン',
	},
	fr: {
		prepare: 'Préparez-vous',
		work: 'Travail',
		rest: 'Repos',
		focus: 'Concentration',
		shortBreak: 'Pause courte',
		longBreak: 'Pause longue',
		step: 'Étape',
		overtime: 'Temps supplémentaire',
		elapsed: 'Temps',
		countdown: 'Minuteur',
	},
	de: {
		prepare: 'Bereit machen',
		work: 'Arbeit',
		rest: 'Pause',
		focus: 'Fokus',
		shortBreak: 'Kurze Pause',
		longBreak: 'Lange Pause',
		step: 'Schritt',
		overtime: 'Überzeit',
		elapsed: 'Zeit',
		countdown: 'Countdown',
	},
	ko: {
		prepare: '준비',
		work: '작업',
		rest: '휴식',
		focus: '집중',
		shortBreak: '짧은 휴식',
		longBreak: '긴 휴식',
		step: '단계',
		overtime: '추가 시간',
		elapsed: '경과',
		countdown: '카운트다운',
	},
	it: {
		prepare: 'Preparati',
		work: 'Lavoro',
		rest: 'Riposo',
		focus: 'Concentrazione',
		shortBreak: 'Pausa breve',
		longBreak: 'Pausa lunga',
		step: 'Passo',
		overtime: 'Tempo extra',
		elapsed: 'Tempo',
		countdown: 'Conto alla rovescia',
	},
};

/** Current language dictionary, replaced on boot. */
export let STR: AppStrings = pt;

/** Applies the full string set for the given language. */
export function setStrings(lang: Lang): void {
	const d = dicts[lang] ?? pt;
	STR = d;
	Object.assign(MODE_NAMES, modesAll[lang] ?? modesPt);
	Object.assign(SOUND_NAMES, soundsAll[lang] ?? soundsAll.pt);
	Object.assign(DISPLAY_NAMES, displaysAll[lang] ?? displaysAll.pt);
	Object.assign(THEME_NAMES, themesAll[lang] ?? themesAll.pt);
	Object.assign(PHASE_NAMES, phasesAll[lang] ?? phasesAll.pt);
}

/** Screen-reader-friendly announce of remaining time (uses the active language). */
export function ariaRemaining(sec: number, label: string): string {
	const a = STR.aria;
	if (sec <= 0) return label ? `${label} ${a.doneSuffix}` : a.doneSuffix;
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	const mTxt = a.minuteUnit(m);
	const sTxt = a.secondsUnit(s);
	return `${label ? label + ' — ' : ''}${m > 0 ? mTxt + (s > 0 ? a.conjunction : '') : ''}${s > 0 ? sTxt : ''} ${a.remaining}`;
}